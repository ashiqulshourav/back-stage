import { user } from "./user";
import { metaData } from "./metadata";
import { saleData } from "./sale";
import { sattleData } from "./sattle";

export const API = {
  ...user,
  ...metaData,
  ...saleData,
  ...sattleData,
}
