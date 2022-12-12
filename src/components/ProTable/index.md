## 说明

ProTable是根据医修库设计习惯抽象出的表格组件，底层基于antd Table。应用场景就是常规的查询列表。如所做的业务模块为特殊列表结构，可直接应用antd Table

<br/> 
<br/> 

## Demo

参考src/pages/Assets/index.tsx

<br/> 
<br/> 

## API

|  属性   | 描述  | 类型 | 默认值 |
|  ----  | ----  | ----  | ----  |
| request  | 获取dataSource的方法 | (query: Q) => Promise<{ data: T[]; total: number; [key: string]: any }>  | - |
| actionRef  | Table action 的引用，便于自定义触发 | MutableRefObject<ActionType>  | - |
| formRef  | 可以获取到查询表单的 form 实例，用于一些灵活的配置 | MutableRefObject<FormInstance>  | - |
| toolBarRender  | 渲染工具栏，支持返回一个 dom 数组，会自动增加 margin-right | (() => ReactNode[] | false) | false;  | - |
| rowKey  | 同antd Table rowKey | - | - |
| title  | 表格标题 | string | - |
| columns  | ProTable的列配置 | ProTableColumn<T>[] | - |
| dataSource  | 使用外部传入数据源进行表格渲染 | T[] | - |
| params | request查询时所需要的额外参数 | Record<string, any> | {} |
| onRow  | 同antd Table onRow | - | - |
| rowSelection  | 同antd Table rowSelection | - | - |
| isSyncToUrl  | 是否将查询表单值同步到url地址栏 | boolean | - |
| defaultQuery  | 默认查询参数 | Q | - |
| renderForm  | 自定义搜索表单 | (config: {collapsed: boolean;loading: boolean;onClickCollapse: () => void;onSearch: () => void;}) => ReactNode; | - |
| hooks  | 自定义钩子函数，用于在不同时机触发不用操作，定义参考下方hooks说明 | - | - |
| options | 菜单栏 options 配置 | TableOptions | { density: true, reload: true, setting: true } |
| formProps  | 搜索表单的props，属性同antd FormProps | - | - |
| tableProps  | 表格props，同antd TableProps | - | - |


<br/> 
<br/> 

## ProTableColumn

|  属性   | 描述  | 类型 | 默认值 |
|  ----  | ----  | ----  | ----  |
|  hideInSearch  | 该列是否作为查询表单的一项 | Boolean  | false  |
|  hideInTable  | 该列是否显示在表格中 | Boolean  | true  |
|  formItemProps  | 同antd Form.Item的props | - | - |
|  valueType  | 值的类型,会生成不同的渲染器 | 'text' | 'select' | 'tree-select' | 'text' |
|  valueOptions  | 如表单项组件类型为select，可传入 | - | - ｜
|  renderFormItem  | 渲染查询表单的输入组件 | (form: FormInstance) => ReactNode; | - ｜


<br/> 
<br/> 

## hooks

|  属性   | 描述  | 类型 | 默认值 |
|  ----  | ----  | ----  | ----  |
|  beforeInit  | 搜索表单初始化之前触发，常用于初始化之前对query进行处理并返回  | (query: Q) => any;  | -  |
|  beforeSubmit  | 点击搜索之前触发  | (formValues: any) => any;  | -  |
|  beforeReset  | 点击重置之前触发  | (query: Q) => any;  | -  |
|  onSearch  | 点击搜索/查询时触发  | () => void; | -  |
|  onReset  | 点击重置时触发  | () => void;  | -  |
|  onReload  | 点击toolbar刷新时触发  | () => void;  | - |
|  onLoad  | 数据加载完成后触发  | (dataSource: T[], total: number) => void  | - |
|  postData  | 对通过 request 获取的数据进行处理  | (dataSource: T[]) => T[]  | - |
|  onLoadingChange  | loading 被修改时触发，一般是网络请求导致的  | (loading?: boolean) => void  | - |
|  onRequestError  | 请求发生错误时触发  | (error: any) => void | -  |


<br/> 
<br/> 

## actionRef

|  属性   | 描述  | 类型 | 默认值 |
|  ----  | ----  | ----  | ----  |
|  reload  | 重新进行一次request请求，resetPageIndex表示是否重置到第一页  | (resetPageIndex?: boolean) => void  | -  |
|  reset  | 重置请求  | () => void  | - |
|  resetSearchForm  | 仅仅重置查询表单，不进行请求  | () => void  | - |

## options（菜单栏配置）

|  属性   | 描述  | 类型 | 默认值 |
|  ----  | ----  | ----  | ----  |
| reload | 刷新操作 | boolean | true |
| setting | 列显示配置 | boolean | true |
| density | 密度 | boolean | true |