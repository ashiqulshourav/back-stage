import { columns as manualColumn } from '../component/manualSettlement/tableCoumnLIst';
import { columns as otherSettleColumn } from '../component/otherSettlement/tableCoumnLIst';

export function useManualUnsettlement() {

  return {
    manualColumn,
    otherSettleColumn
  }
}