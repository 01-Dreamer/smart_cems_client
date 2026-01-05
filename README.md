# 智慧校园能耗监测与管理平台 (前端)

## 项目简介
本项目是“智慧校园能耗监测与管理平台”的前端部分，基于 Vue 3 + TypeScript + Vite + Element Plus + Pinia + ECharts 开发。

## 技术栈
- **Vue 3**: 核心框架
- **TypeScript**: 静态类型检查
- **Vite**: 构建工具
- **Element Plus**: UI 组件库
- **Pinia**: 状态管理
- **Vue Router**: 路由管理
- **Axios**: HTTP 请求库
- **ECharts**: 图表库

## 功能模块
1. **用户认证**: 登录、注册 (JWT)
2. **建筑管理**: 建筑列表、添加建筑
3. **设备管理**: 设备列表、添加设备
4. **实时监控**: 查看设备实时能耗数据
5. **告警记录**: 查看历史告警信息
6. **统计分析**: 设备功率趋势图、建筑用电占比图

## 快速开始

### 安装依赖
```sh
npm install
```

### 启动开发服务器
```sh
npm run dev
```

### 构建生产版本
```sh
npm run build
```

## 目录结构
- `src/api`: API 接口定义
- `src/layout`: 布局组件
- `src/router`: 路由配置
- `src/stores`: Pinia 状态管理
- `src/utils`: 工具函数 (如 Axios 封装)
- `src/views`: 页面视图


## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
