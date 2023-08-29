CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE types AS ENUM ('PDF', 'JPEG', 'PNG', 'WEBP');

CREATE TABLE pages (
  id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  type types NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  site VARCHAR NOT NULL,
  file VARCHAR NOT NULL
);

CREATE OR REPLACE FUNCTION paginationSelectHelper(
    in sort_field VARCHAR,
    in id UUID,
    in greater BOOLEAN
)
RETURNS VARCHAR AS
$$
DECLARE
    base_select VARCHAR := format('(select %s from pages where id = %L)', sort_field, id);
BEGIN
    IF greater THEN
        RETURN format('(%s > %s or (%s = %s and id > %L))', sort_field, base_select, sort_field, base_select, id);
    ELSE
        RETURN format('(%s < %s or (%s = %s and id < %L))', sort_field, base_select, sort_field, base_select, id);
    END IF;
END;
$$ LANGUAGE PLpgSQL;

CREATE OR REPLACE FUNCTION paginationSelect(
    in first INTEGER DEFAULT NULL,
    in last INTEGER DEFAULT NULL,
    in before UUID DEFAULT NULL,
    in after UUID DEFAULT NULL,
    in options JSONB DEFAULT NULL -- { sort, filters }
)
RETURNS TABLE(
  id UUID,
  type types,
  date DATE,
  site VARCHAR,
  file VARCHAR
) AS
$$
DECLARE
    result_order VARCHAR(4) := 'ASC';
    result_limit INTEGER := 100;
    where_filters VARCHAR := '';
    sort VARCHAR := '';
    filters VARCHAR := '';
BEGIN
    IF first IS NOT NULL THEN
        result_limit := first;
    ELSIF last IS NOT NULL THEN
        result_limit := last;
    END IF;
    
    IF options ? 'sort' THEN
        sort := CONCAT(options ->> 'sort', ', ');
        result_order := SPLIT_PART(options ->> 'sort', ' ', 2);
    END IF;

    IF before IS NOT NULL THEN
        IF options ? 'sort' THEN 
            where_filters := CONCAT('WHERE ', paginationSelectHelper(SPLIT_PART(options ->> 'sort', ' ', 1), before, result_order != 'ASC')); -- result_order = 'ASC'
        ELSE
            where_filters := format('WHERE id < %L', before);
        END IF;
    ELSIF after IS NOT NULL THEN 
        IF options ? 'sort' THEN 
            where_filters := CONCAT('WHERE ', paginationSelectHelper(SPLIT_PART(options ->> 'sort', ' ', 1), after, result_order = 'ASC'));
        ELSE
            where_filters := format('WHERE id > %L', after);
        END IF;
    END IF;

    IF options ? 'filters' THEN
        IF jsonb_array_length(options -> 'filters') > 0 THEN
            IF where_filters != '' THEN
                where_filters := CONCAT(where_filters, ' AND ');
            ELSE
                where_filters := 'WHERE ';
            END IF;

            SELECT string_agg(value::text, ' AND ') AS joined_string
            INTO filters
            FROM jsonb_array_elements(options -> 'filters') AS value;

            where_filters := CONCAT(where_filters, replace(filters, '"', ''));
        END IF;
    END IF;

    IF last IS NOT NULL THEN
        RETURN QUERY
        EXECUTE format(' 
            SELECT id, type, date, site, file
            FROM (
                SELECT *, ROW_NUMBER() OVER (
                    ORDER BY %s id ASC
                ) AS row_num FROM pages %s ORDER BY %s id ASC LIMIT %s
            ) AS subquery
            ORDER BY row_num DESC
        ', sort, where_filters, sort, result_limit);
    ELSE
        RETURN QUERY
        EXECUTE format('SELECT * FROM pages %s ORDER BY %s id ASC LIMIT %s', where_filters, sort, result_limit);
    END IF;
END;
$$ LANGUAGE PLpgSQL;

CREATE OR REPLACE FUNCTION paginationInfo(
    in first INTEGER DEFAULT NULL,
    in last INTEGER DEFAULT NULL,
    in before UUID DEFAULT NULL,
    in after UUID DEFAULT NULL,
    in options JSONB DEFAULT NULL -- { sort, filters }
)
RETURNS JSONB AS
$$
DECLARE
    has_next_page BOOLEAN := false;
    has_previous_page BOOLEAN := false;
    start_cursor UUID := NULL;
    end_cursor UUID := NULL;
    cursor UUID := NULL;
BEGIN

    IF before IS NOT NULL THEN
        cursor := before;
    ELSE
        cursor := after;
    END IF;

    SELECT id
    INTO start_cursor
    FROM paginationSelect(
        first, last, before, after, options
    ) LIMIT 1;


    SELECT id
    INTO end_cursor
    FROM (
        SELECT *, ROW_NUMBER() OVER () AS row_num
        FROM paginationSelect(
            first, last, before, after, options
        )
    ) AS subquery
    ORDER BY row_num DESC
    LIMIT 1;

    SELECT COUNT(*) > 0
    INTO has_previous_page
    FROM paginationSelect(
        first, last, start_cursor, NULL, options
    ) WHERE id <> cursor
    LIMIT 1;

    SELECT COUNT(*) > 0
    INTO has_next_page
    FROM paginationSelect(
        first, last, NULL, end_cursor, options
    ) WHERE id <> cursor
    LIMIT 1;

    RETURN json_build_object(
        'hasNextPage', has_next_page,
        'hasPreviousPage', has_previous_page,
        'startCursor', start_cursor,
        'endCursor', end_cursor
    );
    
END;
$$ LANGUAGE PLpgSQL;
