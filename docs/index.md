```tsx
  import React, { useRef } from 'react';
  import ProTable from '@/components/ProTable';
  import type { ActionType, ProTableColumn } from '@/components/ProTable';

  interface ITableListItem {
    id: number;
    name: string;
    age: number;
    position: string;
  }

  const fetchAPI = () => {
    const fakeData = [
      {
        id: 1,
        name: 'react',
        age: 3,
        position: '前端',
      },
      {
        id: 2,
        name: 'vue',
        age: 3,
        position: '前端',
      }
    ];
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: fakeData,
          total: 2,
        });
      }, 3000);
    });
  }

  const DemoPage: React.FC = () => {
    const actionRef = useRef<ActionType>();

    const columns: ProTableColumn<ITableListItem>[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '职位',
        dataIndex: 'position',
        key: 'position',
      }
    ];

    return (
      <ProTable<ITableListItem, any> 
        rowKey="id"
        defaultQuery={{}}
        actionRef={actionRef}
        columns={columns}
        request={async (query) => {
          return fetchAPI();
        }}
      />
    )
  }

  export default DemoPage;
```