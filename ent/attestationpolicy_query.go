// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"fmt"
	"math"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/in-toto/archivista/ent/attestationpolicy"
	"github.com/in-toto/archivista/ent/predicate"
	"github.com/in-toto/archivista/ent/statement"
)

// AttestationPolicyQuery is the builder for querying AttestationPolicy entities.
type AttestationPolicyQuery struct {
	config
	ctx           *QueryContext
	order         []attestationpolicy.OrderOption
	inters        []Interceptor
	predicates    []predicate.AttestationPolicy
	withStatement *StatementQuery
	withFKs       bool
	modifiers     []func(*sql.Selector)
	loadTotal     []func(context.Context, []*AttestationPolicy) error
	// intermediate query (i.e. traversal path).
	sql  *sql.Selector
	path func(context.Context) (*sql.Selector, error)
}

// Where adds a new predicate for the AttestationPolicyQuery builder.
func (apq *AttestationPolicyQuery) Where(ps ...predicate.AttestationPolicy) *AttestationPolicyQuery {
	apq.predicates = append(apq.predicates, ps...)
	return apq
}

// Limit the number of records to be returned by this query.
func (apq *AttestationPolicyQuery) Limit(limit int) *AttestationPolicyQuery {
	apq.ctx.Limit = &limit
	return apq
}

// Offset to start from.
func (apq *AttestationPolicyQuery) Offset(offset int) *AttestationPolicyQuery {
	apq.ctx.Offset = &offset
	return apq
}

// Unique configures the query builder to filter duplicate records on query.
// By default, unique is set to true, and can be disabled using this method.
func (apq *AttestationPolicyQuery) Unique(unique bool) *AttestationPolicyQuery {
	apq.ctx.Unique = &unique
	return apq
}

// Order specifies how the records should be ordered.
func (apq *AttestationPolicyQuery) Order(o ...attestationpolicy.OrderOption) *AttestationPolicyQuery {
	apq.order = append(apq.order, o...)
	return apq
}

// QueryStatement chains the current query on the "statement" edge.
func (apq *AttestationPolicyQuery) QueryStatement() *StatementQuery {
	query := (&StatementClient{config: apq.config}).Query()
	query.path = func(ctx context.Context) (fromU *sql.Selector, err error) {
		if err := apq.prepareQuery(ctx); err != nil {
			return nil, err
		}
		selector := apq.sqlQuery(ctx)
		if err := selector.Err(); err != nil {
			return nil, err
		}
		step := sqlgraph.NewStep(
			sqlgraph.From(attestationpolicy.Table, attestationpolicy.FieldID, selector),
			sqlgraph.To(statement.Table, statement.FieldID),
			sqlgraph.Edge(sqlgraph.O2O, true, attestationpolicy.StatementTable, attestationpolicy.StatementColumn),
		)
		fromU = sqlgraph.SetNeighbors(apq.driver.Dialect(), step)
		return fromU, nil
	}
	return query
}

// First returns the first AttestationPolicy entity from the query.
// Returns a *NotFoundError when no AttestationPolicy was found.
func (apq *AttestationPolicyQuery) First(ctx context.Context) (*AttestationPolicy, error) {
	nodes, err := apq.Limit(1).All(setContextOp(ctx, apq.ctx, "First"))
	if err != nil {
		return nil, err
	}
	if len(nodes) == 0 {
		return nil, &NotFoundError{attestationpolicy.Label}
	}
	return nodes[0], nil
}

// FirstX is like First, but panics if an error occurs.
func (apq *AttestationPolicyQuery) FirstX(ctx context.Context) *AttestationPolicy {
	node, err := apq.First(ctx)
	if err != nil && !IsNotFound(err) {
		panic(err)
	}
	return node
}

// FirstID returns the first AttestationPolicy ID from the query.
// Returns a *NotFoundError when no AttestationPolicy ID was found.
func (apq *AttestationPolicyQuery) FirstID(ctx context.Context) (id int, err error) {
	var ids []int
	if ids, err = apq.Limit(1).IDs(setContextOp(ctx, apq.ctx, "FirstID")); err != nil {
		return
	}
	if len(ids) == 0 {
		err = &NotFoundError{attestationpolicy.Label}
		return
	}
	return ids[0], nil
}

// FirstIDX is like FirstID, but panics if an error occurs.
func (apq *AttestationPolicyQuery) FirstIDX(ctx context.Context) int {
	id, err := apq.FirstID(ctx)
	if err != nil && !IsNotFound(err) {
		panic(err)
	}
	return id
}

// Only returns a single AttestationPolicy entity found by the query, ensuring it only returns one.
// Returns a *NotSingularError when more than one AttestationPolicy entity is found.
// Returns a *NotFoundError when no AttestationPolicy entities are found.
func (apq *AttestationPolicyQuery) Only(ctx context.Context) (*AttestationPolicy, error) {
	nodes, err := apq.Limit(2).All(setContextOp(ctx, apq.ctx, "Only"))
	if err != nil {
		return nil, err
	}
	switch len(nodes) {
	case 1:
		return nodes[0], nil
	case 0:
		return nil, &NotFoundError{attestationpolicy.Label}
	default:
		return nil, &NotSingularError{attestationpolicy.Label}
	}
}

// OnlyX is like Only, but panics if an error occurs.
func (apq *AttestationPolicyQuery) OnlyX(ctx context.Context) *AttestationPolicy {
	node, err := apq.Only(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// OnlyID is like Only, but returns the only AttestationPolicy ID in the query.
// Returns a *NotSingularError when more than one AttestationPolicy ID is found.
// Returns a *NotFoundError when no entities are found.
func (apq *AttestationPolicyQuery) OnlyID(ctx context.Context) (id int, err error) {
	var ids []int
	if ids, err = apq.Limit(2).IDs(setContextOp(ctx, apq.ctx, "OnlyID")); err != nil {
		return
	}
	switch len(ids) {
	case 1:
		id = ids[0]
	case 0:
		err = &NotFoundError{attestationpolicy.Label}
	default:
		err = &NotSingularError{attestationpolicy.Label}
	}
	return
}

// OnlyIDX is like OnlyID, but panics if an error occurs.
func (apq *AttestationPolicyQuery) OnlyIDX(ctx context.Context) int {
	id, err := apq.OnlyID(ctx)
	if err != nil {
		panic(err)
	}
	return id
}

// All executes the query and returns a list of AttestationPolicies.
func (apq *AttestationPolicyQuery) All(ctx context.Context) ([]*AttestationPolicy, error) {
	ctx = setContextOp(ctx, apq.ctx, "All")
	if err := apq.prepareQuery(ctx); err != nil {
		return nil, err
	}
	qr := querierAll[[]*AttestationPolicy, *AttestationPolicyQuery]()
	return withInterceptors[[]*AttestationPolicy](ctx, apq, qr, apq.inters)
}

// AllX is like All, but panics if an error occurs.
func (apq *AttestationPolicyQuery) AllX(ctx context.Context) []*AttestationPolicy {
	nodes, err := apq.All(ctx)
	if err != nil {
		panic(err)
	}
	return nodes
}

// IDs executes the query and returns a list of AttestationPolicy IDs.
func (apq *AttestationPolicyQuery) IDs(ctx context.Context) (ids []int, err error) {
	if apq.ctx.Unique == nil && apq.path != nil {
		apq.Unique(true)
	}
	ctx = setContextOp(ctx, apq.ctx, "IDs")
	if err = apq.Select(attestationpolicy.FieldID).Scan(ctx, &ids); err != nil {
		return nil, err
	}
	return ids, nil
}

// IDsX is like IDs, but panics if an error occurs.
func (apq *AttestationPolicyQuery) IDsX(ctx context.Context) []int {
	ids, err := apq.IDs(ctx)
	if err != nil {
		panic(err)
	}
	return ids
}

// Count returns the count of the given query.
func (apq *AttestationPolicyQuery) Count(ctx context.Context) (int, error) {
	ctx = setContextOp(ctx, apq.ctx, "Count")
	if err := apq.prepareQuery(ctx); err != nil {
		return 0, err
	}
	return withInterceptors[int](ctx, apq, querierCount[*AttestationPolicyQuery](), apq.inters)
}

// CountX is like Count, but panics if an error occurs.
func (apq *AttestationPolicyQuery) CountX(ctx context.Context) int {
	count, err := apq.Count(ctx)
	if err != nil {
		panic(err)
	}
	return count
}

// Exist returns true if the query has elements in the graph.
func (apq *AttestationPolicyQuery) Exist(ctx context.Context) (bool, error) {
	ctx = setContextOp(ctx, apq.ctx, "Exist")
	switch _, err := apq.FirstID(ctx); {
	case IsNotFound(err):
		return false, nil
	case err != nil:
		return false, fmt.Errorf("ent: check existence: %w", err)
	default:
		return true, nil
	}
}

// ExistX is like Exist, but panics if an error occurs.
func (apq *AttestationPolicyQuery) ExistX(ctx context.Context) bool {
	exist, err := apq.Exist(ctx)
	if err != nil {
		panic(err)
	}
	return exist
}

// Clone returns a duplicate of the AttestationPolicyQuery builder, including all associated steps. It can be
// used to prepare common query builders and use them differently after the clone is made.
func (apq *AttestationPolicyQuery) Clone() *AttestationPolicyQuery {
	if apq == nil {
		return nil
	}
	return &AttestationPolicyQuery{
		config:        apq.config,
		ctx:           apq.ctx.Clone(),
		order:         append([]attestationpolicy.OrderOption{}, apq.order...),
		inters:        append([]Interceptor{}, apq.inters...),
		predicates:    append([]predicate.AttestationPolicy{}, apq.predicates...),
		withStatement: apq.withStatement.Clone(),
		// clone intermediate query.
		sql:  apq.sql.Clone(),
		path: apq.path,
	}
}

// WithStatement tells the query-builder to eager-load the nodes that are connected to
// the "statement" edge. The optional arguments are used to configure the query builder of the edge.
func (apq *AttestationPolicyQuery) WithStatement(opts ...func(*StatementQuery)) *AttestationPolicyQuery {
	query := (&StatementClient{config: apq.config}).Query()
	for _, opt := range opts {
		opt(query)
	}
	apq.withStatement = query
	return apq
}

// GroupBy is used to group vertices by one or more fields/columns.
// It is often used with aggregate functions, like: count, max, mean, min, sum.
//
// Example:
//
//	var v []struct {
//		Name string `json:"name,omitempty"`
//		Count int `json:"count,omitempty"`
//	}
//
//	client.AttestationPolicy.Query().
//		GroupBy(attestationpolicy.FieldName).
//		Aggregate(ent.Count()).
//		Scan(ctx, &v)
func (apq *AttestationPolicyQuery) GroupBy(field string, fields ...string) *AttestationPolicyGroupBy {
	apq.ctx.Fields = append([]string{field}, fields...)
	grbuild := &AttestationPolicyGroupBy{build: apq}
	grbuild.flds = &apq.ctx.Fields
	grbuild.label = attestationpolicy.Label
	grbuild.scan = grbuild.Scan
	return grbuild
}

// Select allows the selection one or more fields/columns for the given query,
// instead of selecting all fields in the entity.
//
// Example:
//
//	var v []struct {
//		Name string `json:"name,omitempty"`
//	}
//
//	client.AttestationPolicy.Query().
//		Select(attestationpolicy.FieldName).
//		Scan(ctx, &v)
func (apq *AttestationPolicyQuery) Select(fields ...string) *AttestationPolicySelect {
	apq.ctx.Fields = append(apq.ctx.Fields, fields...)
	sbuild := &AttestationPolicySelect{AttestationPolicyQuery: apq}
	sbuild.label = attestationpolicy.Label
	sbuild.flds, sbuild.scan = &apq.ctx.Fields, sbuild.Scan
	return sbuild
}

// Aggregate returns a AttestationPolicySelect configured with the given aggregations.
func (apq *AttestationPolicyQuery) Aggregate(fns ...AggregateFunc) *AttestationPolicySelect {
	return apq.Select().Aggregate(fns...)
}

func (apq *AttestationPolicyQuery) prepareQuery(ctx context.Context) error {
	for _, inter := range apq.inters {
		if inter == nil {
			return fmt.Errorf("ent: uninitialized interceptor (forgotten import ent/runtime?)")
		}
		if trv, ok := inter.(Traverser); ok {
			if err := trv.Traverse(ctx, apq); err != nil {
				return err
			}
		}
	}
	for _, f := range apq.ctx.Fields {
		if !attestationpolicy.ValidColumn(f) {
			return &ValidationError{Name: f, err: fmt.Errorf("ent: invalid field %q for query", f)}
		}
	}
	if apq.path != nil {
		prev, err := apq.path(ctx)
		if err != nil {
			return err
		}
		apq.sql = prev
	}
	return nil
}

func (apq *AttestationPolicyQuery) sqlAll(ctx context.Context, hooks ...queryHook) ([]*AttestationPolicy, error) {
	var (
		nodes       = []*AttestationPolicy{}
		withFKs     = apq.withFKs
		_spec       = apq.querySpec()
		loadedTypes = [1]bool{
			apq.withStatement != nil,
		}
	)
	if apq.withStatement != nil {
		withFKs = true
	}
	if withFKs {
		_spec.Node.Columns = append(_spec.Node.Columns, attestationpolicy.ForeignKeys...)
	}
	_spec.ScanValues = func(columns []string) ([]any, error) {
		return (*AttestationPolicy).scanValues(nil, columns)
	}
	_spec.Assign = func(columns []string, values []any) error {
		node := &AttestationPolicy{config: apq.config}
		nodes = append(nodes, node)
		node.Edges.loadedTypes = loadedTypes
		return node.assignValues(columns, values)
	}
	if len(apq.modifiers) > 0 {
		_spec.Modifiers = apq.modifiers
	}
	for i := range hooks {
		hooks[i](ctx, _spec)
	}
	if err := sqlgraph.QueryNodes(ctx, apq.driver, _spec); err != nil {
		return nil, err
	}
	if len(nodes) == 0 {
		return nodes, nil
	}
	if query := apq.withStatement; query != nil {
		if err := apq.loadStatement(ctx, query, nodes, nil,
			func(n *AttestationPolicy, e *Statement) { n.Edges.Statement = e }); err != nil {
			return nil, err
		}
	}
	for i := range apq.loadTotal {
		if err := apq.loadTotal[i](ctx, nodes); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

func (apq *AttestationPolicyQuery) loadStatement(ctx context.Context, query *StatementQuery, nodes []*AttestationPolicy, init func(*AttestationPolicy), assign func(*AttestationPolicy, *Statement)) error {
	ids := make([]int, 0, len(nodes))
	nodeids := make(map[int][]*AttestationPolicy)
	for i := range nodes {
		if nodes[i].statement_policy == nil {
			continue
		}
		fk := *nodes[i].statement_policy
		if _, ok := nodeids[fk]; !ok {
			ids = append(ids, fk)
		}
		nodeids[fk] = append(nodeids[fk], nodes[i])
	}
	if len(ids) == 0 {
		return nil
	}
	query.Where(statement.IDIn(ids...))
	neighbors, err := query.All(ctx)
	if err != nil {
		return err
	}
	for _, n := range neighbors {
		nodes, ok := nodeids[n.ID]
		if !ok {
			return fmt.Errorf(`unexpected foreign-key "statement_policy" returned %v`, n.ID)
		}
		for i := range nodes {
			assign(nodes[i], n)
		}
	}
	return nil
}

func (apq *AttestationPolicyQuery) sqlCount(ctx context.Context) (int, error) {
	_spec := apq.querySpec()
	if len(apq.modifiers) > 0 {
		_spec.Modifiers = apq.modifiers
	}
	_spec.Node.Columns = apq.ctx.Fields
	if len(apq.ctx.Fields) > 0 {
		_spec.Unique = apq.ctx.Unique != nil && *apq.ctx.Unique
	}
	return sqlgraph.CountNodes(ctx, apq.driver, _spec)
}

func (apq *AttestationPolicyQuery) querySpec() *sqlgraph.QuerySpec {
	_spec := sqlgraph.NewQuerySpec(attestationpolicy.Table, attestationpolicy.Columns, sqlgraph.NewFieldSpec(attestationpolicy.FieldID, field.TypeInt))
	_spec.From = apq.sql
	if unique := apq.ctx.Unique; unique != nil {
		_spec.Unique = *unique
	} else if apq.path != nil {
		_spec.Unique = true
	}
	if fields := apq.ctx.Fields; len(fields) > 0 {
		_spec.Node.Columns = make([]string, 0, len(fields))
		_spec.Node.Columns = append(_spec.Node.Columns, attestationpolicy.FieldID)
		for i := range fields {
			if fields[i] != attestationpolicy.FieldID {
				_spec.Node.Columns = append(_spec.Node.Columns, fields[i])
			}
		}
	}
	if ps := apq.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if limit := apq.ctx.Limit; limit != nil {
		_spec.Limit = *limit
	}
	if offset := apq.ctx.Offset; offset != nil {
		_spec.Offset = *offset
	}
	if ps := apq.order; len(ps) > 0 {
		_spec.Order = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	return _spec
}

func (apq *AttestationPolicyQuery) sqlQuery(ctx context.Context) *sql.Selector {
	builder := sql.Dialect(apq.driver.Dialect())
	t1 := builder.Table(attestationpolicy.Table)
	columns := apq.ctx.Fields
	if len(columns) == 0 {
		columns = attestationpolicy.Columns
	}
	selector := builder.Select(t1.Columns(columns...)...).From(t1)
	if apq.sql != nil {
		selector = apq.sql
		selector.Select(selector.Columns(columns...)...)
	}
	if apq.ctx.Unique != nil && *apq.ctx.Unique {
		selector.Distinct()
	}
	for _, p := range apq.predicates {
		p(selector)
	}
	for _, p := range apq.order {
		p(selector)
	}
	if offset := apq.ctx.Offset; offset != nil {
		// limit is mandatory for offset clause. We start
		// with default value, and override it below if needed.
		selector.Offset(*offset).Limit(math.MaxInt32)
	}
	if limit := apq.ctx.Limit; limit != nil {
		selector.Limit(*limit)
	}
	return selector
}

// AttestationPolicyGroupBy is the group-by builder for AttestationPolicy entities.
type AttestationPolicyGroupBy struct {
	selector
	build *AttestationPolicyQuery
}

// Aggregate adds the given aggregation functions to the group-by query.
func (apgb *AttestationPolicyGroupBy) Aggregate(fns ...AggregateFunc) *AttestationPolicyGroupBy {
	apgb.fns = append(apgb.fns, fns...)
	return apgb
}

// Scan applies the selector query and scans the result into the given value.
func (apgb *AttestationPolicyGroupBy) Scan(ctx context.Context, v any) error {
	ctx = setContextOp(ctx, apgb.build.ctx, "GroupBy")
	if err := apgb.build.prepareQuery(ctx); err != nil {
		return err
	}
	return scanWithInterceptors[*AttestationPolicyQuery, *AttestationPolicyGroupBy](ctx, apgb.build, apgb, apgb.build.inters, v)
}

func (apgb *AttestationPolicyGroupBy) sqlScan(ctx context.Context, root *AttestationPolicyQuery, v any) error {
	selector := root.sqlQuery(ctx).Select()
	aggregation := make([]string, 0, len(apgb.fns))
	for _, fn := range apgb.fns {
		aggregation = append(aggregation, fn(selector))
	}
	if len(selector.SelectedColumns()) == 0 {
		columns := make([]string, 0, len(*apgb.flds)+len(apgb.fns))
		for _, f := range *apgb.flds {
			columns = append(columns, selector.C(f))
		}
		columns = append(columns, aggregation...)
		selector.Select(columns...)
	}
	selector.GroupBy(selector.Columns(*apgb.flds...)...)
	if err := selector.Err(); err != nil {
		return err
	}
	rows := &sql.Rows{}
	query, args := selector.Query()
	if err := apgb.build.driver.Query(ctx, query, args, rows); err != nil {
		return err
	}
	defer rows.Close()
	return sql.ScanSlice(rows, v)
}

// AttestationPolicySelect is the builder for selecting fields of AttestationPolicy entities.
type AttestationPolicySelect struct {
	*AttestationPolicyQuery
	selector
}

// Aggregate adds the given aggregation functions to the selector query.
func (aps *AttestationPolicySelect) Aggregate(fns ...AggregateFunc) *AttestationPolicySelect {
	aps.fns = append(aps.fns, fns...)
	return aps
}

// Scan applies the selector query and scans the result into the given value.
func (aps *AttestationPolicySelect) Scan(ctx context.Context, v any) error {
	ctx = setContextOp(ctx, aps.ctx, "Select")
	if err := aps.prepareQuery(ctx); err != nil {
		return err
	}
	return scanWithInterceptors[*AttestationPolicyQuery, *AttestationPolicySelect](ctx, aps.AttestationPolicyQuery, aps, aps.inters, v)
}

func (aps *AttestationPolicySelect) sqlScan(ctx context.Context, root *AttestationPolicyQuery, v any) error {
	selector := root.sqlQuery(ctx)
	aggregation := make([]string, 0, len(aps.fns))
	for _, fn := range aps.fns {
		aggregation = append(aggregation, fn(selector))
	}
	switch n := len(*aps.selector.flds); {
	case n == 0 && len(aggregation) > 0:
		selector.Select(aggregation...)
	case n != 0 && len(aggregation) > 0:
		selector.AppendSelect(aggregation...)
	}
	rows := &sql.Rows{}
	query, args := selector.Query()
	if err := aps.driver.Query(ctx, query, args, rows); err != nil {
		return err
	}
	defer rows.Close()
	return sql.ScanSlice(rows, v)
}
