import { user } from "./user";
import { metaData } from "./metadata";
import { saleData } from "./sale";
import { sattleData } from "./sattle";
import { virtualData } from "./virtual";
import { esportData } from "./esports";
import { historyData } from "./history";
import { operationLogData } from "./operationLog";
import { esportsSettlement } from "./esportsSettlement";
import { configCenterData } from "./configCenter";
import { playMethodData } from "./playMethd";
import { userMangerData } from "./userManger";
import { roleData } from "./role";
import { bettingCenter } from "./bettingCenter";
import {taskCenter} from "@/api/taskCenter";

export const API = {
  ...user,
  ...metaData,
  ...saleData,
  ...sattleData,
  ...virtualData,
  ...esportData,
  ...historyData,
  ...roleData,
  ...operationLogData,
  ...esportsSettlement,
  ...configCenterData,
  ...userMangerData,
  ...playMethodData,
  ...bettingCenter,
  ...taskCenter
}
