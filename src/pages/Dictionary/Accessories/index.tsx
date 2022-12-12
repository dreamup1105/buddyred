import React, { useState, useEffect } from 'react';
import { Row, Col, Divider, message, Popconfirm } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import useLoading from './hooks/useLoading';
import {
  fetchManufacturers,
  fetchProducts,
  fetchModels,
  delManufacturer,
  delProduct,
  delModel,
} from './service';
import type {
  IManufacturerItem,
  IProductItem,
  IModelItem,
  BizType,
} from './type';
import { OperationType } from './type';
import ReplaceDict from './components/ReplaceDict';
import CreateDictForm from './components/CreateDictForm';
import BizTable from './components/Table';
import useQuery from './hooks/useQueryState';
import styles from './index.less';

const getBizConfig = (): BizType | undefined => {
  const { pathname } = history.location;
  const biz = pathname.replace('/dictionary/', '');

  switch (biz) {
    case 'accessories': // 配件字典
      return 'part';
    case 'equipment': // 设备字典
      return 'equipment';
    default:
      return undefined;
  }
};

const DictionaryAccessoriesPage: React.FC = () => {
  const { query, setQuery, getPagination, setTotal } = useQuery();
  const bizType = getBizConfig();
  const { loadingState, dispatch } = useLoading();
  const [manufacturers, setManufacturers] = useState<IManufacturerItem[]>([]);
  const [products, setProducts] = useState<IProductItem[]>([]);
  const [models, setModels] = useState<IModelItem[]>([]);
  const [currentRecord, setCurrentRecord] = useState<
    IManufacturerItem | IProductItem | IModelItem
  >(); // 当前正在操作的record，可能是厂商｜产品｜型号
  const [manufacturerRecord, setManufacturerRecord] =
    useState<IManufacturerItem>();
  const [productRecord, setProductRecord] = useState<IProductItem>();
  const [modelRecord, setModelRecord] = useState<IModelItem>();
  const [operation, setOperation] = useState<OperationType>(OperationType.NOOP);
  const [replaceDictVisible, setReplaceDictVisible] = useState<boolean>(false);
  const [createDictVisible, setCreateDictVisible] = useState<boolean>(false);
  const [params, setParams] = useState<{
    manufacturerId?: number;
    productId?: number;
  }>();

  // 获取厂商列表数据
  const loadManufactures = async () => {
    dispatch({ type: 'showManufacturerLoading' });
    try {
      const { current, pageSize, q } = query.manufacturer;
      const { data = [], total = 0 } = await fetchManufacturers(
        bizType!,
        q || '',
        current,
        pageSize,
      );
      if (data) {
        setManufacturers(data);
      }
      if (typeof total === 'number') {
        setTotal('manufacturer', total);
      }
      if (data?.length) {
        setManufacturerRecord(data[0]);
      } else {
        setManufacturerRecord(undefined);
        setProductRecord(undefined);
        setProducts([]);
        setModelRecord(undefined);
        setModels([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: 'hideManufacturerLoading' });
    }
  };

  // 获取产品列表
  const loadProducts = async (q?: string) => {
    if (!manufacturerRecord?.id) {
      return;
    }
    dispatch({ type: 'showProductLoading' });
    try {
      const { q: productQ } = query.product;
      const { data = [], total = 0 } = await fetchProducts(bizType!, {
        q: typeof q === 'string' ? q : productQ,
        manufacturerId: manufacturerRecord!.id,
      });
      if (data) {
        setProducts(data);
      }
      if (typeof total === 'number') {
        setTotal('product', total);
      }
      if (data?.length) {
        setProductRecord(data[0]);
      } else {
        setProductRecord(undefined);
        setModelRecord(undefined);
        setModels([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: 'hideProductLoading' });
    }
  };

  // 获取型号
  const loadModels = async () => {
    if (!productRecord?.id) {
      return;
    }
    dispatch({ type: 'showModelLoading' });
    try {
      const { data = [], total = 0 } = await fetchModels(bizType!, {
        q: '',
        productId: productRecord.id,
      });
      if (data) {
        setModels(data);
      }
      if (typeof total === 'number') {
        setTotal('model', total);
      }
      setModelRecord(data?.length ? data[0] : undefined);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: 'hideModelLoading' });
    }
  };

  const onClickOperation = async (
    action: OperationType,
    record?: IManufacturerItem | IProductItem,
  ) => {
    try {
      setOperation(action);
      switch (action) {
        case OperationType.CREATE_MANUFACTURER: // 新增厂商
        case OperationType.CREATE_PRODUCT: // 新增产品
        case OperationType.CREATE_MODEL: // 新增型号
          setCreateDictVisible(true);
          break;
        case OperationType.REPLACE_MANUFACTURER: // 替换厂商
        case OperationType.REPLACE_PRODUCT: // 替换产品
        case OperationType.REPLACE_MODEL: // 替换型号
          setCurrentRecord(record);
          setReplaceDictVisible(true);
          break;
        case OperationType.EDIT_MANUFACTURER: // 编辑厂商
        case OperationType.EDIT_PRODUCT: // 编辑产品
        case OperationType.EDIT_MODEL: // 编辑型号
          setCurrentRecord(record);
          setCreateDictVisible(true);
          break;
        case OperationType.DELETE_MANUFACTURER: // 删除厂商
          await delManufacturer(bizType!, record!.id!);
          message.success('删除厂商成功');
          loadManufactures();
          break;
        case OperationType.DELETE_PRODUCT: // 删除产品
          await delProduct(bizType!, record!.id!);
          loadProducts();
          break;
        case OperationType.DELETE_MODEL: // 删除型号
          await delModel(bizType!, record!.id!);
          loadModels();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 提交替换
  const onReplaceDictSubmit = (targetId: number, action: OperationType) => {
    switch (action) {
      case OperationType.REPLACE_MANUFACTURER: // 替换厂商
        message.success('替换厂商成功');
        loadManufactures();
        break;
      case OperationType.REPLACE_PRODUCT: // 替换产品
        message.success('替换产品成功');
        loadProducts();
        break;
      case OperationType.REPLACE_MODEL: // 替换型号
        message.success('替换型号成功');
        loadModels();
        break;
      default:
        break;
    }
    setReplaceDictVisible(false);
  };

  // 提交创建/编辑字典项
  const onCreateDictSubmit = (action: OperationType) => {
    switch (action) {
      case OperationType.CREATE_MANUFACTURER:
        message.success('新增厂商成功');
        loadManufactures();
        break;
      case OperationType.EDIT_MANUFACTURER:
        message.success('编辑厂商成功');
        loadManufactures();
        break;
      case OperationType.CREATE_PRODUCT:
        message.success('新增产品成功');
        loadProducts();
        break;
      case OperationType.EDIT_PRODUCT:
        message.success('编辑产品成功');
        loadProducts();
        break;
      case OperationType.CREATE_MODEL:
        message.success('新增型号成功');
        loadModels();
        break;
      case OperationType.EDIT_MODEL:
        message.success('编辑型号成功');
        loadModels();
        break;
      default:
        break;
    }
    setCreateDictVisible(false);
  };

  const manufacturerColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      render: (_: any, record: IManufacturerItem) => {
        return (
          <>
            <a
              onClick={() =>
                onClickOperation(OperationType.EDIT_MANUFACTURER, record)
              }
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a
              onClick={() =>
                onClickOperation(OperationType.REPLACE_MANUFACTURER, record)
              }
            >
              替换
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定要删除该条记录吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={() =>
                onClickOperation(OperationType.DELETE_MANUFACTURER, record)
              }
            >
              <a>删除</a>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const productColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      render: (_: any, record: IProductItem) => {
        return (
          <>
            <a
              onClick={() =>
                onClickOperation(OperationType.EDIT_PRODUCT, record)
              }
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a
              onClick={() =>
                onClickOperation(OperationType.REPLACE_PRODUCT, record)
              }
            >
              替换
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定要删除该条记录吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={() =>
                onClickOperation(OperationType.DELETE_PRODUCT, record)
              }
            >
              <a>删除</a>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const modelColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      render: (_: any, record: IModelItem) => {
        return (
          <>
            <a
              onClick={() => onClickOperation(OperationType.EDIT_MODEL, record)}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a
              onClick={() =>
                onClickOperation(OperationType.REPLACE_MODEL, record)
              }
            >
              替换
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定要删除该条记录吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={() =>
                onClickOperation(OperationType.DELETE_MODEL, record)
              }
            >
              <a>删除</a>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    loadManufactures();
  }, [
    query.manufacturer.current,
    query.manufacturer.pageSize,
    query.manufacturer.q,
  ]);

  useEffect(() => {
    if (manufacturerRecord) {
      loadProducts('');
      setQuery((prevQuery) => ({ ...prevQuery, productQ: '' }));
      setParams((prevParams) => ({
        ...prevParams,
        manufacturerId: manufacturerRecord.id,
      }));
    }
  }, [manufacturerRecord]);

  useEffect(() => {
    if (productRecord) {
      loadModels();
      setParams((prevParams) => ({
        ...prevParams,
        productId: productRecord.id,
      }));
    }
  }, [productRecord]);

  return (
    <PageContainer className={styles.container}>
      <div className={styles.manufacturerTableWrapper}>
        <BizTable<IManufacturerItem>
          type="manufacturer"
          searchValue={query.manufacturer.q}
          pagination={getPagination('manufacturer')}
          onClickRow={(record) => setManufacturerRecord(record)}
          onSearch={(q: string) => {
            if (
              query.manufacturer.q === q &&
              query.manufacturer.current === 1
            ) {
              loadManufactures();
            } else {
              setQuery((prevQuery) => ({
                ...prevQuery,
                manufacturer: {
                  ...prevQuery.manufacturer,
                  q,
                  current: 1,
                },
              }));
            }
            setQuery((prevQuery) => ({
              ...prevQuery,
              product: {
                ...prevQuery.product,
                q: '',
              },
            }));
          }}
          onAdd={() => onClickOperation(OperationType.CREATE_MANUFACTURER)}
          dataSource={manufacturers}
          columns={manufacturerColumns}
          loading={loadingState.manufacturerLoading}
          currentRecord={manufacturerRecord}
        />
      </div>
      <Row gutter={16} className={styles.bottomTableWrapper}>
        <Col span={12} className={styles.prodTableWrapper}>
          <BizTable<IProductItem>
            type="product"
            searchValue={query.product.q}
            manufacturers={manufacturers}
            pagination={getPagination('product')}
            onClickRow={(record) => setProductRecord(record)}
            onSearch={(q: string) => {
              loadProducts(q);
              setQuery((prevQuery) => ({
                ...prevQuery,
                product: { ...prevQuery.product, q },
              }));
            }}
            onAdd={() => onClickOperation(OperationType.CREATE_PRODUCT)}
            dataSource={products}
            columns={productColumns}
            loading={loadingState.productLoading}
            currentRecord={productRecord}
          />
        </Col>
        <Col span={12} className={styles.modelTableWrapper}>
          <BizTable<IModelItem>
            type="model"
            products={products}
            pagination={getPagination('model')}
            onClickRow={(record) => setModelRecord(record)}
            onAdd={() => onClickOperation(OperationType.CREATE_MODEL)}
            dataSource={models}
            columns={modelColumns}
            loading={loadingState.modelLoading}
            currentRecord={modelRecord}
          />
        </Col>
      </Row>
      <CreateDictForm
        visible={createDictVisible}
        currentRecord={currentRecord}
        operation={operation}
        params={params}
        bizType={bizType}
        onCancel={() => setCreateDictVisible(false)}
        onSubmit={onCreateDictSubmit}
      />
      <ReplaceDict
        operation={operation}
        visible={replaceDictVisible}
        currentRecord={currentRecord}
        bizType={bizType}
        onCancel={() => setReplaceDictVisible(false)}
        onSubmit={onReplaceDictSubmit}
      />
    </PageContainer>
  );
};

export default DictionaryAccessoriesPage;
