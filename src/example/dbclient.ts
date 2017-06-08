// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {DBClient} from "../database/dbclient";
import {DriverType} from "../database/driveroptions";
import {SelectQuery} from "../sqlquery/selectquery";

import {TableName, Column} from "../base/decorator";
import {Model, SqlType, SqlFlag} from "../base/model";
import {QueryResult} from "../database/queryresult";

@TableName("users")
export class User extends Model {
  @Column("uid", SqlType.INT, SqlFlag.PRIMARY_KEY, "主键")
  uid: number;

  @Column("username", SqlType.VARCHAR_255, SqlFlag.NOT_NULL)
  username: string;

  @Column("display_name", SqlType.VARCHAR_255, SqlFlag.NULLABLE, "真实姓名")
  displayName: string;

  @Column("meta", SqlType.JSON, SqlFlag.NULLABLE)
  meta: any;

  @Column("created_at", SqlType.TIMESTAMP, SqlFlag.NULLABLE)
  createdAt: Date;

  @Column("updated_at", SqlType.TIMESTAMP, SqlFlag.NULLABLE)
  updatedAt: number;
}

(async () => {
  // 创建 DBClient 全局单例
  DBClient.createClient({
    type: DriverType.POSTGRES,
    username: "postgres",
    password: "111111",
    host: "localhost",
    database: "gago"
  });

  const fetchUsersQuery: SelectQuery = new SelectQuery().fromClass(User).select();
  const result: QueryResult = await DBClient.getClient().query(fetchUsersQuery);
  console.log(`there are ${result.rows.length} users`);
})();
