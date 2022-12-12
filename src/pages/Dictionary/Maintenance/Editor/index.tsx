import React, { useState, useRef } from 'react';
import {
  Row,
  Col,
  Button,
  Space,
  Input,
  Form,
  message,
  Radio,
  Spin,
} from 'antd';
import type { RadioChangeEvent } from 'antd';
import { useLocation, useParams } from 'umi';
import { WaterMark } from '@ant-design/pro-layout';
import useMount from '@/hooks/useMount';
import usePrint from '@/hooks/usePrint';
import PrintContainer from '@/components/PrintContainer';
import ResultModal from '@/components/Result';
import {
  fetchTemplate,
  fetchTemplateContent,
  fetchTemplateContext,
  saveTemplateBasicInfo,
  saveTemplateContent,
} from '@/pages/Dictionary/Maintenance/Template/service';
import type {
  IVersionItem,
  ITemplateContext,
} from '@/pages/Dictionary/Maintenance/Template/type';
import { escapeTime } from '@/utils/utils';
import type {
  IComponentNode,
  IMaintainItemWithVersion,
  ActionType,
} from './type';
import { TemplateBizType } from './type';
import { InitComponentData } from './type';
import {
  fetchMaintainItemsWithVersion,
  fetchSpecVersion,
  fetchTemplateForSpecs,
} from './service';
import Editor from './Editor';
import styles from './index.less';
import useUserInfo from '@/hooks/useUserInfo';
import { TemplateFor } from '../type';

const EditorPage: React.FC = () => {
  const { currentUser } = useUserInfo();
  const isAdmin = currentUser?.user.isAdmin;
  const orgId = currentUser?.org.id;
  const [createForm] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const { query } = useLocation() as any;
  const params = useParams() as any;
  const { componentRef, onPrint: emitPrint } = usePrint();
  const [maintainItems, setMaintainItems] = useState<
    IMaintainItemWithVersion[]
  >([]);
  const [templateForItems, setTemplateForItems] = useState<
    IMaintainItemWithVersion[]
  >([]);
  const [contexts, setContexts] = useState<ITemplateContext[]>([]);
  const [initComponentData, setInitComponentData] = useState<IComponentNode[]>(
    [],
  );
  const [componentDataSnapshot, setComponentDataSnapshot] = useState<
    IComponentNode[]
  >([]);
  const [currentVersion, setCurrentVersion] = useState<IVersionItem>(); // 当前保养项目版本
  const readonly = params.action === 'preview'; // 是否为纯预览
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [verId, setVerId] = useState(query.verId); // 模板的版本id
  const [specVerId, setSpecVerId] = useState(query.specId); // 保养规范版本id

  // 获取系统保养项目集
  const initTemplate = () => {
    setInitComponentData(InitComponentData);
  };

  // 获取上下文项目集
  const loadContexts = async () => {
    try {
      const { data } = await fetchTemplateContext();
      setContexts(data);
    } catch (error) {
      console.error(error);
    }
  };

  // 获取指定保养项目规范所对应的保养项目集
  // 获取平台保养项目集
  const loadMaintainItems = async (specId?: number) => {
    try {
      const res = await fetchMaintainItemsWithVersion(
        specId || Number(query.specId),
      );
      res.data.items.forEach((item: any) => {
        item.details.forEach((detail: any) => {
          detail.optionsString = detail.options.join(',');
        });
      });
      setMaintainItems(res.data.items);
      console.log(res.data.items);
      return res.data.items || [];
    } catch (error) {
      console.error(error);
      setMaintainItems([]);
      return [];
    }
  };

  const loadTemplateForItems = async () => {
    try {
      const res = await fetchTemplateForSpecs();
      res.data.items.forEach((item: any) => {
        item.details.forEach((detail: any) => {
          detail.optionsString = detail.options.join(',');
        });
      });
      setTemplateForItems(res.data.items);
      return res.data.items || [];
    } catch (error) {
      setTemplateForItems([]);
      return [];
    }
  };

  // 获取默认保养项目规范版本信息
  const loadDefaultVersion = async () => {
    const res = await fetchSpecVersion(Number(query.specId));
    setCurrentVersion(res.data);
  };

  // 获取模板内容
  const loadTemplateContent = async () => {
    setLoading(true);
    try {
      const { data } = await fetchTemplateContent(
        Number(query.id),
        Number(query.verId),
      );
      const template = JSON.parse(data.body);
      const originalComponentData = template.content;
      setInitComponentData(originalComponentData);
    } catch (error) {
      message.error('模板内容解析错误，请重新添加模板');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 获取模板基本信息
  const loadTemplateBasicInfo = async () => {
    try {
      const { data } = await fetchTemplate(Number(query.id));
      createForm.setFieldsValue({
        templateName: data.name,
        templateId: data.id,
        // templateType: data.applyType,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // 获取当前组件树中的所有指标项code集合
  const getBizIds = () => {
    const contextNode = componentDataSnapshot?.find(
      (component) => component.type === 'CONTEXT',
    );
    const contextBizIds =
      contextNode?.children?.map((item) => item.properties!.contextBizId!) ??
      [];

    const groups =
      componentDataSnapshot?.filter(
        (component) => component.type === 'GROUP',
      ) || [];

    const groupBizIds = groups.reduce((acc: number[], cur) => {
      const currentGroupBizIds = cur.children!.reduce(
        (accBizItem: number[], curBizItem) =>
          accBizItem.concat([curBizItem.bizId!]),
        [],
      );
      return acc.concat(currentGroupBizIds);
    }, []);

    return [contextBizIds, groupBizIds];
  };

  // 打印
  const onPrint = () => {
    emitPrint!();
  };

  // 切换模式
  const onModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
  };

  // 继续编辑
  const onContinueEdit = () => {
    const formValues: any = createForm.getFieldsValue();
    window.location.href = `//${window.location.host}/dictionary/maintenance/template/edit?id=${formValues.templateId}&specId=${specVerId}&verId=${verId}`;
  };

  // 保存模板
  const onSave = async () => {
    if (saving) {
      return;
    }
    setSaving(true);
    try {
      const formValues: any = await createForm.validateFields();
      const res = await saveTemplateBasicInfo({
        id: formValues.templateId,
        name: formValues.templateName.trim(),
        specVerId: currentVersion?.id,
        orgId: isAdmin ? null : orgId,
        templateFor: isAdmin
          ? TemplateFor.PLATFORM
          : TemplateFor.OTHER_PLATFORM,
        applyType: TemplateBizType.MAINTAIN, //保存时默认选择保养模版
      });

      if (res.code === 0) {
        createForm.setFieldsValue({ templateId: res.data.id });
        setSpecVerId(res.data.specVerId);
        const [contextBizIds, groupBizIds] = getBizIds();
        const saveRes = await saveTemplateContent(res.data.id, {
          body: JSON.stringify({
            version: 'v1',
            type: formValues.templateType,
            content: componentDataSnapshot,
          }),
          meta: {
            applyType: TemplateBizType.MAINTAIN, //保存时默认选择保养模版,
            itemIds: groupBizIds,
            codeList: contextBizIds,
            specVerId: currentVersion!.id,
          },
        });
        if (saveRes.code === 0) {
          setVerId(saveRes.data.maintainTemplate.verId);
        }
        setResultVisible(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  useMount(() => {
    loadContexts();
    switch (params.action) {
      case 'add':
        document.title = '模板创建';
        loadMaintainItems();
        loadTemplateForItems();
        initTemplate();
        loadDefaultVersion();
        break;
      case 'edit':
        document.title = '模板编辑';
        loadTemplateContent();
        loadTemplateBasicInfo();
        loadMaintainItems();
        loadTemplateForItems();
        loadDefaultVersion();
        break;
      case 'preview':
        document.title = '预览';
        loadTemplateContent();
        break;
      default:
        break;
    }
  });

  return (
    <>
      <div className={styles.editorWrapper}>
        {!readonly && (
          <Form form={createForm}>
            <Row justify="center" gutter={16}>
              <Col span={12}>
                <Row className={styles.topForm} gutter={16}>
                  <Col span={10}>
                    <Form.Item
                      label="模板名称"
                      name="templateName"
                      rules={[
                        {
                          required: true,
                          message: '请填写模板名称',
                        },
                        {
                          whitespace: true,
                          message: `模板名称不能只包含空格`,
                        },
                      ]}
                    >
                      <Input placeholder="请填写" />
                    </Form.Item>
                    <Form.Item hidden label="模板id" name="templateId">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={14} style={{ textAlign: 'right' }}>
                    <Space>
                      <span>
                        {currentVersion?.tag}（v{currentVersion?.verNo} -{' '}
                        {escapeTime(currentVersion?.lastModifiedTime)}）
                      </span>
                    </Space>
                  </Col>
                </Row>
                <div style={{ textAlign: 'center' }}>
                  <Radio.Group onChange={onModeChange} defaultValue="edit">
                    <Radio.Button value="edit">编辑</Radio.Button>
                    <Radio.Button value="preview">预览</Radio.Button>
                  </Radio.Group>
                </div>
              </Col>
            </Row>
          </Form>
        )}
        <Spin spinning={loading}>
          <Editor
            actionRef={actionRef}
            mode={readonly || mode === 'preview' ? 'PREVIEW' : 'EDIT'}
            componentData={initComponentData}
            bizItems={maintainItems}
            templateForItems={templateForItems}
            contexts={contexts}
            onChange={(data) => setComponentDataSnapshot(data)}
          />
        </Spin>
      </div>
      <Row className={styles.bottomToolbar}>
        <Col span={24}>
          <Space>
            <Button
              onClick={() => {
                window.location.replace(
                  `//${window.location.host}/dictionary/maintenance/template`,
                );
              }}
              style={{ width: 160 }}
            >
              返回
            </Button>
            <Button onClick={onPrint} style={{ width: 160 }}>
              打印
            </Button>
            {!readonly && (
              <Button
                type="primary"
                loading={saving}
                onClick={onSave}
                style={{ width: 160 }}
              >
                保存
              </Button>
            )}
          </Space>
        </Col>
      </Row>
      <ResultModal
        visible={resultVisible}
        onCancel={() => setResultVisible(false)}
        closable={false}
        resultProps={{
          title: '操作成功',
          status: 'success',
          extra: [
            <Button type="primary" key="edit" onClick={onContinueEdit}>
              继续编辑
            </Button>,
            <Button
              key="back"
              onClick={() => {
                window.location.replace(
                  `//${window.location.host}/dictionary/maintenance/template`,
                );
              }}
            >
              返回
            </Button>,
          ],
        }}
      />
      <PrintContainer>
        <div ref={componentRef}>
          <WaterMark content="医修库">
            <Editor mode="DETAIL" componentData={componentDataSnapshot} />
          </WaterMark>
        </div>
      </PrintContainer>
    </>
  );
};

export default EditorPage;
