<template>
	<table class="vertical-table">
		<tr v-for="(column, index) in columns" :key="index">
			<th>{{ t(column.label) }}</th>
			<td>
				<div v-for="(key, index) in column.keys" :key="index">
					{{ handleNullValue(dataList[key]) }}
				</div>
			</td>
		</tr>
	</table>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';

defineProps<{ 
	columns: { label: string; keys: string[]; }[];
	dataList: [];
}>()

const handleNullValue = (value: string | number) => {
	return value ? value : '-';
}
</script>
<style lang="scss">
.vertical-table {
	border-collapse: collapse;
	border-spacing: 0;
	width: 100%;
}

.vertical-table th,
.vertical-table td {
	text-align: left;
	padding: 16px;
	border: 1px solid rgb(248 250 252);
}

.vertical-table tr:nth-child(even) {
	background-color: #F2F2F2;
}
.vertical-table tr:nth-child(odd) {
	background-color: #FFFFFF;
}
</style>
