// 路由状态参数类型
export interface RouteState {
  phone?: string;  // 敏感信息使用 state
}

// 路由查询参数类型
export interface RouteQuery {
  nickname?: string;  // 可分享信息使用 query
}

// URL 参数解析工具
export const parseQuery = (search: string): RouteQuery => {
  const params = new URLSearchParams(search);
  return {
    nickname: params.get('nickname') || undefined
  };
};

// URL 参数构建工具
export const buildQuery = (params: Partial<RouteQuery>): string => {
  const searchParams = new URLSearchParams();
  if (params.nickname) {
    searchParams.set('nickname', params.nickname);
  }
  return searchParams.toString();
}; 