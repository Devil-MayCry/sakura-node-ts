// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {sqlContext} from "../util/sqlcontext";

/**
 * Builds select sql query.
 */
export class SelectQuery {
  private table_: string;
  private where_: string;
  private selectFields_: string[];
  private orderBys_: {sort: string, order: 'ASC'|'DESC'}[] = [];
  private limit_: number;

  from(table: string): this {
    this.table_ = table;
    return this;
  }

  fromClass(cls: Function): this {
    let table: string = sqlContext.findTableByClass(cls);
    if (table) {
      this.table_ = table;
    }
    return this;
  }

  fromTable(table: string): this {
    this.table_ = table;
    return this;
  }

  select(fields: string[] = []): this {
    this.selectFields_ = fields;
    return this;
  }

  where(...args: any[]): this {
    this.where_ = args.join(' AND ');
    return this;
  }

  orderBy(sort: string, order: 'ASC' | 'DESC' = 'ASC'): this {
    this.orderBys_.push({sort: sort, order: order});
    return this;
  }

  setLimit(limit: number): this {
    this.limit_ = limit;
    return this;
  }

  build(): string {
    let fields: string = '*';
    if (this.selectFields_.length > 0) {
      fields = this.selectFields_.join(',');
    }

    let sql: string = `SELECT ${fields} FROM ${this.table_}`;

    // WHERE
    if (this.where_) {
      sql = `${sql} WHERE ${this.where_}`;
    }

    // ORDER BY
    if (this.orderBys_.length > 0) {
      let orderBySqls: Array<string> = [];
      for (let orderBy of this.orderBys_) {
        orderBySqls.push(`${orderBy.sort} ${orderBy.order}`);
      }
      let orderBySql = orderBySqls.join(',');
      sql = `${sql} ORDER BY ${orderBySql}`;
    }

    // LIMIT
    if (this.limit_) {
      sql = `${sql} LIMIT ${this.limit_}`;
    }

    return sql;
  }
}