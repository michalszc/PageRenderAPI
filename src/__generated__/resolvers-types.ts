import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from '../utils/setup';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Represents a date value in ISO 8601 format. */
  Date: string;
  /** Represents a URL string. */
  URL: string;
  /** Represents a universally unique identifier (UUID). */
  UUID: string;
};

export type DateFilter = {
  /** Filters for dates greater than the specified value. */
  gt?: InputMaybe<Scalars['Date']>;
  /** Filters for dates greater than or equal to the specified value. */
  gte?: InputMaybe<Scalars['Date']>;
  /** Filters for dates less than the specified value. */
  lt?: InputMaybe<Scalars['Date']>;
  /** Filters for dates less than or equal to the specified value. */
  lte?: InputMaybe<Scalars['Date']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a new page. */
  createPage: Result;
  /** Deletes a page. */
  deletePage: Result;
  /** Updates a page. */
  updatePage: Result;
};


export type MutationCreatePageArgs = {
  input: PageInput;
};


export type MutationDeletePageArgs = {
  id: Scalars['UUID'];
};


export type MutationUpdatePageArgs = {
  id: Scalars['UUID'];
  input: PageInput;
};

export type Page = {
  __typename?: 'Page';
  /** The date on which page was created */
  date: Scalars['Date'];
  /** The URL of the page's file. */
  file: Scalars['URL'];
  /** The unique identifier for the page. */
  id: Scalars['UUID'];
  /** The URL of the website. */
  site: Scalars['URL'];
  /** The type of the page (e.g., PDF, JPEG, etc.). */
  type: PageTypeEnum;
};

export type PageEdge = {
  __typename?: 'PageEdge';
  /** A cursor for pagination purposes. */
  cursor: Scalars['UUID'];
  /** The actual page data. */
  node: Page;
};

export type PageFilterInput = {
  /** Filters for pages based on date ranges. */
  date?: InputMaybe<DateFilter>;
  /** Filters for pages based on their types. */
  type?: InputMaybe<PageTypeEnumFilter>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  /** The cursor marking the end of the current set. */
  endCursor: Scalars['UUID'];
  /** Indicates if there are more pages after the current set. */
  hasNextPage: Scalars['Boolean'];
  /** Indicates if there are more pages before the current set. */
  hasPreviousPage: Scalars['Boolean'];
  /** The cursor marking the start of the current set. */
  startCursor: Scalars['UUID'];
};

export type PageInput = {
  /** The URL of the website for the new page. */
  site: Scalars['URL'];
  /** The type of the page. */
  type: PageTypeEnum;
};

export enum PageTypeEnum {
  /** Represents a JPEG image. */
  Jpeg = 'JPEG',
  /** Represents a PDF document. */
  Pdf = 'PDF',
  /** Represents a PNG image. */
  Png = 'PNG',
  /** Represents a WEBP image. */
  Webp = 'WEBP'
}

export type PageTypeEnumFilter = {
  /** Filters for pages with the specified type. */
  eq?: InputMaybe<PageTypeEnum>;
  /** Filters for pages with types in the specified list. */
  in?: InputMaybe<Array<PageTypeEnum>>;
  /** Filters for pages not of the specified type. */
  ne?: InputMaybe<PageTypeEnum>;
  /** Filters for pages not in the specified list of types. */
  nin?: InputMaybe<Array<PageTypeEnum>>;
};

export type Pages = {
  __typename?: 'Pages';
  /** A list of page edges. */
  edges: Array<PageEdge>;
  /** Information about pagination. */
  pageInfo: PageInfo;
};

export type Query = {
  __typename?: 'Query';
  /** Retrieves a specific page by its ID. */
  page: Page;
  /** Retrieves a list of pages. */
  pages?: Maybe<Array<Pages>>;
};


export type QueryPageArgs = {
  id: Scalars['UUID'];
};


export type QueryPagesArgs = {
  after?: InputMaybe<Scalars['UUID']>;
  before?: InputMaybe<Scalars['UUID']>;
  filter?: InputMaybe<PageFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type Result = {
  __typename?: 'Result';
  /** The ID of the affected object. */
  affectedId: Scalars['UUID'];
  /** Error message, if applicable. */
  error?: Maybe<Scalars['String']>;
  /** The associated page in the result. */
  page: Page;
  /** The status of the operation. */
  status: ResultStatusEnum;
};

export enum ResultStatusEnum {
  /** The operation encountered an error. */
  Error = 'ERROR',
  /** The operation was successful. */
  Success = 'SUCCESS'
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DateFilter: DateFilter;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Page: ResolverTypeWrapper<Page>;
  PageEdge: ResolverTypeWrapper<PageEdge>;
  PageFilterInput: PageFilterInput;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PageInput: PageInput;
  PageTypeEnum: PageTypeEnum;
  PageTypeEnumFilter: PageTypeEnumFilter;
  Pages: ResolverTypeWrapper<Pages>;
  Query: ResolverTypeWrapper<{}>;
  Result: ResolverTypeWrapper<Result>;
  ResultStatusEnum: ResultStatusEnum;
  String: ResolverTypeWrapper<Scalars['String']>;
  URL: ResolverTypeWrapper<Scalars['URL']>;
  UUID: ResolverTypeWrapper<Scalars['UUID']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean'];
  Date: Scalars['Date'];
  DateFilter: DateFilter;
  Int: Scalars['Int'];
  Mutation: {};
  Page: Page;
  PageEdge: PageEdge;
  PageFilterInput: PageFilterInput;
  PageInfo: PageInfo;
  PageInput: PageInput;
  PageTypeEnumFilter: PageTypeEnumFilter;
  Pages: Pages;
  Query: {};
  Result: Result;
  String: Scalars['String'];
  URL: Scalars['URL'];
  UUID: Scalars['UUID'];
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createPage?: Resolver<ResolversTypes['Result'], ParentType, ContextType, RequireFields<MutationCreatePageArgs, 'input'>>;
  deletePage?: Resolver<ResolversTypes['Result'], ParentType, ContextType, RequireFields<MutationDeletePageArgs, 'id'>>;
  updatePage?: Resolver<ResolversTypes['Result'], ParentType, ContextType, RequireFields<MutationUpdatePageArgs, 'id' | 'input'>>;
}>;

export type PageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Page'] = ResolversParentTypes['Page']> = ResolversObject<{
  date?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  file?: Resolver<ResolversTypes['URL'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  site?: Resolver<ResolversTypes['URL'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['PageTypeEnum'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageEdge'] = ResolversParentTypes['PageEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Page'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  endCursor?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PagesResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Pages'] = ResolversParentTypes['Pages']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['PageEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  page?: Resolver<ResolversTypes['Page'], ParentType, ContextType, RequireFields<QueryPageArgs, 'id'>>;
  pages?: Resolver<Maybe<Array<ResolversTypes['Pages']>>, ParentType, ContextType, Partial<QueryPagesArgs>>;
}>;

export type ResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Result'] = ResolversParentTypes['Result']> = ResolversObject<{
  affectedId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  page?: Resolver<ResolversTypes['Page'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ResultStatusEnum'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['URL'], any> {
  name: 'URL';
}

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export type Resolvers<ContextType = Context> = ResolversObject<{
  Date?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Page?: PageResolvers<ContextType>;
  PageEdge?: PageEdgeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Pages?: PagesResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Result?: ResultResolvers<ContextType>;
  URL?: GraphQLScalarType;
  UUID?: GraphQLScalarType;
}>;

