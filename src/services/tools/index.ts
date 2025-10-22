// 初始化所有工具
import './weatherTool';
import './guideTool';
import './tripPlanningTool';
import './packingListTool';
import './flightTool';

export { toolRegistry } from './registry';
export type { Tool, ToolCall, ToolResult } from './registry';
