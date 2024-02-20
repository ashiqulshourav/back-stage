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

export const API = {
  ...user,
  ...metaData,
  ...saleData,
  ...sattleData,
  ...virtualData,
  ...esportData,
  ...historyData,
  ...operationLogData,
  ...esportsSettlement,
  ...configCenterData,
  ...playMethodData
}
