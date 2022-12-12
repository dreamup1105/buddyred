import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import type { Route } from '@/models/connect';
import type { Moment } from 'moment';
import { message } from 'antd';
import moment from 'moment';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { MobileDevHost, MobileHost } from './constants';
import type { ITableListItem as DepartmentNode } from '@/pages/Department/type';
import type { DepartmentTreeNode } from '@/pages/Employee/type';
import type { IGroupTreeNode } from '@/pages/User/Role/type';

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

// 验证手机号码
export const phoneRegExp = /^1\d{10}$/;

// 验证邮箱
export const emailRegExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

// 验证数字和小数
export const intOrDecimalRegExp = /^\d+(\.\d+)?$/;

// 验证整数
export const intRegExp = /^\d+$/;

//验证字母或者数字
export const intOrLetterRegExp = /^[a-zA-Z0-9]+[0-9a-zA-Z]*$/;

// 登录密码
export const loginPasswordRegExp = /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z\S\s]{8,16}$/;

// 空格
export const spaceRegExp = /\s+/g;

export const isUrl = (path: string): boolean => reg.test(path);
export const isPhone = (phone: string): boolean => phoneRegExp.test(phone);
export const isEmail = (email: string): boolean => emailRegExp.test(email);
export const isValidLoginPassword = (password: string): boolean =>
  loginPasswordRegExp.test(password);
export const isIntOrDecimal = (input: number | string): boolean =>
  intOrDecimalRegExp.test(String(input ?? ''));
export const isInt = (input: number | string): boolean =>
  intRegExp.test(String(input ?? ''));
export const isSpace = (input: number | string): boolean =>
  spaceRegExp.test(String(input ?? ''));
export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const DefaultDateFormat = 'YYYY-MM-DD HH:mm:ss';
export const WithoutTimeFormat = 'YYYY-MM-DD';
export const MonthFormat = 'YYYY-MM';
export const SecondFormat = 'HH:mm:ss';

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends Route>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(
    ({ routes, path = '/', target = '_self' }) =>
      (path && target !== '_blank' && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach((route) => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

/**
 * 将平铺数组转化为树形结构
 * @param list
 * defaultRootParentId: 该值表示根级节点的parentId是多少，不同接口设置可能不同，目前有null和0两种
 * parentIdKey: 后端返回的数组中，表示父级节点id的key，有的接口是parentDepartmentId,有的是parentId, 所以这里要明确传入
 */
export const buildTree = (
  array: any,
  defaultRootParentId: 0 | null = null,
  parentIdKey: string = 'parentId',
) => {
  if (!Array.isArray(array)) {
    return array;
  }

  const map = {};
  const tree = [];
  const newArray = JSON.parse(JSON.stringify(array));

  for (let i = 0; i < newArray.length; i += 1) {
    map[newArray[i].id] = newArray[i];
    if (newArray[i].childrenNumber) {
      newArray[i].children = [];
    }
  }

  for (let i = 0; i < newArray.length; i += 1) {
    const node = newArray[i];
    if (node[parentIdKey] !== defaultRootParentId) {
      if (
        map[node[parentIdKey]] &&
        Array.isArray(map[node[parentIdKey]].children)
      ) {
        map[node[parentIdKey]].children.push(node);
      }
    } else {
      tree.push(node);
    }
  }

  return tree;
};

/**
 * 将部门节点数据转化为符合TreeSelect要求的数据结构
 * @param trees
 */
export const walkDepartmentsToTrees = (
  trees: DepartmentNode[],
): DepartmentTreeNode[] => {
  return trees.map((node) => {
    if (node.children) {
      return {
        title: node.name,
        value: node.id,
        pId: node.parentDepartmentId,
        children: walkDepartmentsToTrees(node.children),
      };
    }
    return {
      title: node.name,
      value: node.id,
      pId: node.parentDepartmentId,
    };
  });
};

export function isUndef(v: any): boolean {
  return v === undefined || v === null;
}

export function isDef(v: any): boolean {
  return v !== undefined && v !== null;
}

/**
 * 文件对象转换为base64
 * @param file
 */
export const getBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * moment日期对象转换为字符串
 * @param date
 * @param format
 */
export const momentToString = (
  date: Moment | undefined | null,
  format: string = DefaultDateFormat,
) => {
  if (!date) {
    return date;
  }
  return date.format(format);
};

/**
 * 字符串转换为moment对象
 * @param str
 */
export const stringToMoment = (
  str: string | undefined | null | Moment,
): Moment | undefined => {
  if (!str) {
    return undefined;
  }
  return moment(str);
};

/**
 * 从响应头中获取文件名称
 * @param headers
 * @returns
 */
export const getFileName = (headers: Response['headers']) => {
  const randomFilename = moment().format('YYYY-MM-DD');
  if (!headers || !headers.get('content-disposition')) {
    return randomFilename;
  }
  const contentDisposition = headers.get('content-disposition');
  const matchedFilenames = contentDisposition!.match(/filename(?:\*?)=(.*)/);

  if (!matchedFilenames || matchedFilenames.length < 2) {
    return randomFilename;
  }

  return decodeURIComponent(matchedFilenames[1]);
};

/**
 * 后端post请求触发文件下载
 * @param blobUrl
 */
export const download = (data: any, response: Response) => {
  const blob = new Blob([data]);
  const url = window.URL.createObjectURL(blob);
  const filename = getFileName(response.headers);
  const a = document.createElement('a');
  a.download = filename || moment().format('YYYY-MM-DD');
  a.href = url;
  a.click();
};

/**
 * 表格行高亮判断条件
 * @param record
 * @param currentRecord
 */
export const highlightRowClassName = (
  recordId: number | string,
  currentRecordId: number | string | undefined,
) => (recordId === currentRecordId ? 'ant-table-row-selected' : '');

/**
 * 路由树 => 路由Map
 * @param routeData
 */
export const getRouteMap = (routeData: Route[]) => {
  const routeMap = new Map();

  routeData.forEach(function walk(route) {
    routeMap.set(route.path, route);
    if (route.routes?.length) {
      route.routes.forEach(walk);
    }
  });

  return routeMap;
};

/**
 * 获取全局权限列表
 * @param remoteMenus
 * @returns
 */
export const getGlobalAuthorities = (remoteMenus: IGroupTreeNode[]) => {
  return remoteMenus.filter((i) => i.type === 2).map((i) => i.flag);
};

/**
 * 从远端菜单数据中过滤出可用的路由配置
 * @param routeData
 * @param remoteMenus
 */
export const getMenus = (routeData: Route[], remoteMenus: IGroupTreeNode[]) => {
  const routeMap = getRouteMap(routeData);

  return remoteMenus
    .map(function walk(menu): IMenuItem | undefined {
      const hasChildren = !!menu?.children?.length;
      if (menu.type !== 1 || !menu.content) {
        return undefined;
      }
      return {
        ...routeMap.get(menu.content),
        name: menu.name,
        flag: menu.flag,
        apis: menu.apis,
        authority: hasChildren
          ? menu.children!.filter((item) => item.type === 2)
          : [], // 菜单子权限
        routes: hasChildren ? menu.children!.map(walk).filter(Boolean) : [],
      };
    })
    .filter(Boolean)
    .concat([{ component: './404' }]) as IMenuItem[];
};

export const normalFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

// 乘法函数，用来得到精确的乘法结果
export const accMul = (arg1: any, arg2: any) => {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  try {
    if (s1.includes('.')) {
      m += s1.split('.')[1].length;
    }
  } catch (e) {
    console.error(e);
  }
  try {
    if (s2.includes('.')) {
      m += s2.split('.')[1].length;
    }
  } catch (e) {
    console.error(e);
  }
  return (
    (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
    // eslint-disable-next-line no-restricted-properties
    Math.pow(10, m)
  );
};

// 加法函数，用来得到精确的加法结果
export const accAdd = (arg1: any, arg2: any) => {
  let r1 = 0;
  let r2 = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  try {
    if (s1.split('.')[1] !== undefined) {
      r1 = s1.split('.')[1].length;
    }
  } catch (e) {
    console.error(e);
  }

  try {
    if (s2.split('.')[1] !== undefined) {
      r2 = s2.split('.')[1].length;
    }
  } catch (e) {
    console.error(e);
  }
  // eslint-disable-next-line no-restricted-properties
  const m = Math.pow(10, Math.max(r1, r2));
  return (accMul(arg1, m) + accMul(arg2, m)) / m;
};

/**
 * 一般用于表格首列显示自增序号的场景
 * @param index
 * @returns
 */
export const toSeq = (index: number, current: number, pageSize: number) => {
  if (current === 1) {
    if (index < 10) {
      return `0${index}`;
    }
    return index;
  }

  return pageSize * (current - 1) + index;
};

/**
 * 去掉日期字符串中的时间部分
 * 2000-01-01 00:00:00 => 2000-01-01
 * @param date
 * @returns
 */
export const escapeTime = (date: string | undefined | null) => {
  if (!date) {
    return '';
  }

  return date.split(' ')[0];
};

/**
 * 拷贝新的一份数据引用
 * @param data
 * @returns
 */
export const genNewData = (data: any) => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  return JSON.parse(JSON.stringify(data));
};

/**
 * 生成设备二维码
 * @param equipmentId
 * @returns
 */
export const genEquipmentQrCode = (equipmentId: number | string) => {
  const host = process.env.MODE === 'dev' ? MobileDevHost : MobileHost;
  return `https://${host}/equipment/${equipmentId}`;
};

/**
 * 生成防伪信息二维码
 * @param id
 * @returns
 */
export const genAntiFakeQrCode = (id: number | string | undefined) => {
  const host = process.env.MODE === 'dev' ? MobileDevHost : MobileHost;
  return `https://${host}/antiFake/${id}`;
};

/**
 * 生成设备检测二维码
 * @param id
 * @returns
 */
export const genCheckEquipmentCode = (id: number | string | undefined) => {
  const host = process.env.MODE === 'dev' ? MobileDevHost : MobileHost;
  return `https://${host}/checkEquipment/${id}`;
};

/**
 * 给手机号中间4位加星
 * @param phone
 * @returns
 */
export const fuzzyPhone = (phone: any) => {
  if (!phone) {
    return phone;
  }
  return phone.toString().replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

export const formatMoney = (
  number: number,
  decimals = 0,
  decPoint = '.',
  thousandsSep = ',',
) => {
  const newNumber = `${number}`.replace(/[^0-9+-Ee.]/g, '');
  const n = !Number.isFinite(+newNumber) ? 0 : +newNumber;
  const prec = !Number.isFinite(+decimals) ? 0 : Math.abs(decimals);
  const sep = typeof thousandsSep === 'undefined' ? ',' : thousandsSep;
  const dec = typeof decPoint === 'undefined' ? '.' : decPoint;
  let s: any = '';
  const toFixedFix = (num: number, precision: number) => {
    // eslint-disable-next-line no-restricted-properties
    const k = Math.pow(10, precision);
    return `${Math.ceil(num * k) / k}`;
  };
  s = (prec ? toFixedFix(n, prec) : `${Math.round(n)}`).split('.');
  const re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, `$1${sep}$2`);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
};

export const getSpaceValidator = (_: any, value: any) => {
  if (!value?.trim()) {
    return Promise.reject(new Error('姓名不能为空格'));
  }
  return Promise.resolve();
};

/**
 * 获取dom元素样式
 * @param dom
 * @returns
 */
export const getStyle = (dom: Element): CSSStyleDeclaration => {
  // @ts-ignore
  if (window.getComputedStyle) {
    return getComputedStyle(dom, null);
  }
  // @ts-ignore
  return dom.currentStyle;
};

const addPageToDOM = (dom: HTMLElement) => {
  const subNodes = Array.from(dom.querySelectorAll('.report-node')).map(
    (item) => {
      const computedStyle = getStyle(item);
      const marginTop = Number.parseFloat(computedStyle.marginTop);
      const marginBottom = Number.parseFloat(computedStyle.marginBottom);
      return {
        node: item as HTMLElement,
        height: (item as HTMLElement).offsetHeight + marginTop + marginBottom,
        marginBottom,
      };
    },
  );
  const pageHeight = (dom.offsetWidth / 573.28) * 841.89;
  const domHeight = dom.offsetHeight;
  const changedNodes: {
    node: HTMLElement;
    originalMarginBottom: number;
  }[] = []; // 变更多样式的节点

  if (domHeight > pageHeight) {
    const groups = [];
    let currentPage = 0;
    let nodesHeightTotal = 0;
    while (subNodes.length) {
      const currentNode = subNodes.shift()!;
      // 当前节点的高度大于一页的高度，要对该节点的子节点进行分页高度的计算
      if (currentNode.height > pageHeight) {
        console.log('---');
      } else {
        // 加上当前内容超过一页高度时
        // eslint-disable-next-line no-lonely-if
        if (currentNode.height + nodesHeightTotal > pageHeight) {
          currentPage += 1;
          nodesHeightTotal = currentNode.height;
          groups[currentPage] = [currentNode];
        } else {
          if (!groups[currentPage]) {
            groups[currentPage] = [];
          }
          groups[currentPage].push(currentNode);
          nodesHeightTotal += currentNode.height;
        }
      }
    }
    groups.forEach((groupItem, pageIndex) => {
      if (pageIndex !== currentPage) {
        const groupHeight = groupItem.reduce((arr, cur) => arr + cur.height, 0);
        const marginBottom = pageHeight - groupHeight;
        const lastNode = groupItem[groupItem.length - 1];
        const lastNodeDom = lastNode.node;
        lastNodeDom.style.marginBottom = `${marginBottom}px`;
        changedNodes.push({
          node: lastNodeDom,
          originalMarginBottom: lastNode.marginBottom,
        });
      }
    });
  }
  return changedNodes;
};

/**
 * 将dom元素导出到pdf
 * @param dom
 * @param isCompression 是否压缩
 */
export const exportToPDF = async (
  dom: HTMLElement,
  isCompression?: boolean,
): Promise<jsPDF | undefined> => {
  try {
    const changedDomNodes = addPageToDOM(dom);
    const canvas = await html2canvas(dom, {
      allowTaint: false,
      useCORS: true,
      // scale: window.devicePixelRatio ? window.devicePixelRatio : 1,
    });
    // 此时dom已生成canvas，所以需要将变更了位置/边距的dom元素进行样式还原。避免影响页面的正常显示
    setTimeout(() => {
      if (changedDomNodes.length) {
        changedDomNodes.forEach((item) => {
          // eslint-disable-next-line no-param-reassign
          item.node.style.marginBottom = `${item.originalMarginBottom}px`;
        });
      }
    }, 0);
    const contentWidth = canvas.width;
    const contentHeight = canvas.height;
    const per = (contentWidth / 573.28) * 0.75; // 这个主要是为了防止宽度不够的
    // 一页pdf显示html页面生成的canvas高度;
    const pageHeight = (contentWidth / 573.28) * 841.89;
    console.log('pageHeight: ', pageHeight);
    // 未生成pdf的html页面高度
    let leftHeight = contentHeight;
    // 页面偏移
    let position = 0;
    // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
    const imgWidth = 573.28;
    const imgHeight = (573.28 / contentWidth) * contentHeight;
    const pageData = canvas.toDataURL('image/png', 1.0);
    // eslint-disable-next-line new-cap
    const pdf = new jsPDF(undefined, 'pt', 'a4'); // 不分页    // pdf.addImage(pageData, "JPEG", 0, 0, contentWidth, contentHeight);    // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
    // 当内容未超过pdf一页显示的范围，无需分页
    if (leftHeight < pageHeight) {
      if (isCompression) {
        pdf.addImage(
          pageData,
          'JPEG',
          0,
          0,
          imgWidth * per,
          imgHeight * per,
          '',
          'FAST',
        );
      } else {
        pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth * per, imgHeight * per);
      }
    } else {
      while (leftHeight > 0) {
        if (isCompression) {
          pdf.addImage(
            pageData,
            'JPEG',
            0,
            position,
            imgWidth,
            imgHeight,
            '',
            'FAST',
          );
        } else {
          pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
        }
        leftHeight -= pageHeight;
        position -= 841.89;
        // 避免添加空白页
        if (leftHeight > 0) {
          pdf.addPage();
        }
      }
    }
    return pdf;
  } catch (err) {
    console.error(err);
  }
  return undefined;
};

/**
 * 批量导出pdf到zip
 * @param doms
 * @param zipName
 */
export const batchExportToPDF = async (
  doms: HTMLElement[],
  zipName: string,
) => {
  try {
    const pdfs = await Promise.all(doms.map((dom) => exportToPDF(dom, true)));
    const zip = new JSZip();

    await Promise.all(
      pdfs.filter(Boolean).map((item, index) => {
        const filename = doms[index].getAttribute('data-name') ?? index;

        return zip.file(`${filename}.pdf`, item!.output('blob'));
      }),
    );

    const content = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 1,
      },
    });

    saveAs(content, zipName);
  } catch (error) {
    message.error('导出发生错误');
    console.error(error);
  }
};

export const asyncNoop = async () => {};
export const noop = () => {};
export const ExcelAccept =
  '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const tableHeight = window.innerHeight - 230;
