import React, { useRef, useState } from 'react';
import { Card, Breadcrumb, message, Spin, Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProFormInstance } from '@ant-design/pro-form';
import { StepsForm } from '@ant-design/pro-form';
import {
  momentToString,
  stringToMoment,
  WithoutTimeFormat,
} from '@/utils/utils';
import { Link, history } from 'umi';
import useMount from '@/hooks/useMount';
import {
  fetchCompanyList,
  fetchSignDetail,
  fetchCopySignDetail,
} from '../service';
import SignFormContainer from '../hooks/useSignForm';
import { genDraftSign } from '../service';
import StepDraft from '../components/Steps/Draft';
import StepResult from '../components/Steps/Result';
import StepEquipment from '../components/Steps/Equipment';
import './index.less';

const getBizConfig = () => {
  const {
    location: { query, pathname },
  } = history;

  const actionType = pathname.split('/').pop();

  switch (actionType) {
    case 'create':
      return {
        actionType,
        title: '新建签约',
      };
    case 'edit':
      return {
        title: '编辑签约',
        actionType,
        id: query?.id,
      };
    case 'copy':
      return {
        title: '复制签约',
        actionType,
        id: query?.id,
      };
    default:
      return {};
  }
};

// 新建签约
const SignCreatePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const signForm = SignFormContainer.useContainer();
  const formRef = useRef<ProFormInstance>();
  const bizConfig = getBizConfig();
  const renderSteps = () => {
    switch (signForm.values.current) {
      case 0:
        return `选择公司`;
      case 1:
        return `选择公司 - 选择设备`;
      case 2:
        return `选择公司 - 选择设备 - 确定签约`;
      default:
        return '';
    }
  };

  const renderBreadcrumb = () => {
    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href="/">首页</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>客户管理</Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/crm/sign">签约管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{renderSteps()}</Breadcrumb.Item>
      </Breadcrumb>
    );
  };

  const loadSignDetail = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const service =
        bizConfig.actionType === 'edit' ? fetchSignDetail : fetchCopySignDetail;
      const { data, code } = await service(Number(bizConfig.id));
      if (code === 0) {
        signForm.updateForm((prevValues) => {
          return {
            ...prevValues,
            actionType: bizConfig.actionType ?? '',
            id: data.id,
            crId: data.crId,
            startDate: data.beginDate,
            endDate: data.endDate,
            projects: data.agreeTypes,
            euqipmentCount: data.agreeCount,
            companyName: prevValues.companyOptions.find(
              (item) => item.value === data.crId,
            )?.label,
          };
        });
        formRef.current?.setFieldsValue({
          company: data.crId,
          projects: data.agreeTypes,
          date: [
            data.beginDate ? stringToMoment(data.beginDate) : undefined,
            data.endDate ? stringToMoment(data.endDate) : undefined,
          ],
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const init = async () => {
    try {
      const { code, data } = await fetchCompanyList();
      if (code === 0) {
        signForm.updateForm((prevValues) => ({
          ...prevValues,
          companyOptions: data.map((i) => ({ label: i.name, value: i.crId })),
        }));
      }
    } catch (error) {
      console.error(error);
    }

    if (bizConfig.actionType !== 'create' && bizConfig.id) {
      loadSignDetail();
    }
  };

  useMount(init);

  return (
    <PageContainer
      title={
        <>
          {bizConfig?.title}
          <div>
            <a onClick={() => history.goBack()} style={{ fontSize: '14px' }}>
              <LeftOutlined />
              返回
            </a>
          </div>
        </>
      }
      header={{
        breadcrumbRender: () => renderBreadcrumb(),
      }}
    >
      <Card bordered={false}>
        <Spin spinning={loading}>
          <StepsForm
            formProps={{
              layout: 'horizontal',
              labelCol: {
                span: 5,
              },
              labelAlign: 'right',
            }}
            formRef={formRef}
            containerStyle={{
              minWidth: signForm.values.current === 1 ? '100%' : '520px',
              textAlign: signForm.values.current === 1 ? 'center' : 'inherit',
            }}
            current={signForm.values.current}
            onCurrentChange={(current) => {
              signForm.updateForm((prevValues) => ({
                ...prevValues,
                current,
              }));
            }}
            submitter={{
              render: (props, dom) => {
                if (props.step === 2) {
                  return null;
                }
                if (props.step === 0) {
                  return (
                    <Button
                      type="primary"
                      style={{ marginLeft: 150 }}
                      onClick={() => props.onSubmit?.()}
                    >
                      下一步
                    </Button>
                  );
                }
                return dom;
              },
            }}
          >
            <StepsForm.StepForm<any>
              title="选择公司"
              onFinish={async () => {
                const step1FormValues = formRef.current?.getFieldsValue();
                const crId = step1FormValues!.company;
                const projects = step1FormValues?.projects;
                const startDate = momentToString(
                  step1FormValues?.date[0],
                  WithoutTimeFormat,
                )!;
                const endDate = momentToString(
                  step1FormValues?.date[1],
                  WithoutTimeFormat,
                )!;
                const { code, data } = await genDraftSign({
                  aid: signForm.values.id,
                  agreeTypes: projects,
                  beginDate: startDate,
                  endDate,
                  crId,
                });
                if (code === 0) {
                  const company = signForm.values.companyOptions.find(
                    (i) => i.value === step1FormValues!.company,
                  );
                  signForm.updateForm((prevValues) => ({
                    ...prevValues,
                    id: data.id,
                    projects: projects!,
                    startDate,
                    endDate,
                    company: company!.label!,
                    crId,
                  }));
                  return true;
                }
                return false;
              }}
            >
              <StepDraft />
            </StepsForm.StepForm>
            <StepsForm.StepForm<any>
              title="选择设备"
              onFinish={async () => {
                const selectedEquipmentCount = signForm.values.euqipmentCount;

                if (selectedEquipmentCount === 0) {
                  message.warning('签约设备不能为空');
                  return false;
                }

                return true;
              }}
            >
              <StepEquipment />
            </StepsForm.StepForm>
            <StepsForm.StepForm title="确定签约">
              <StepResult />
            </StepsForm.StepForm>
          </StepsForm>
        </Spin>
      </Card>
    </PageContainer>
  );
};

const SignCreatePageWrap = () => (
  <SignFormContainer.Provider>
    <SignCreatePage />
  </SignFormContainer.Provider>
);

export default SignCreatePageWrap;
