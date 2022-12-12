import React, { useState, useEffect } from 'react';
import { message, Table } from 'antd';
import type { Teammate, TeamDetail } from '../type';
import { fetchTeammates } from '../service';

interface TeammateListProps {
  team?: TeamDetail;
}
const TeammateList: React.FC<TeammateListProps> = ({ team }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [teammates, setTeammates] = useState<Teammate[]>([]);

  useEffect(() => {
    async function loadTeammates() {
      if (!team) return;
      setLoading(true);
      try {
        const { data } = await fetchTeammates(team.id);
        setTeammates(data);
      } catch (err) {
        message.error(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTeammates();
  }, [team]);

  if (!team) return null;

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '电话',
      dataIndex: 'phone',
    },
  ];

  return (
    <Table<Teammate>
      size="small"
      pagination={false}
      dataSource={teammates}
      loading={loading}
      rowKey="employeeId"
      columns={columns}
    />
  );
};

export default TeammateList;
