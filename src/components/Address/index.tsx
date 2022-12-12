import React, { useState, useEffect } from 'react';
import { Cascader } from 'antd';
import { CodeDictionarysEnum } from '@/utils/constants';
import { fetchCodeDictionarys } from '@/services/dictionary';

interface IComponentProps {
  value?: string[];
  onChange?: (selectedOptions: string[]) => void;
  provinces: AddressOption[];
}

const Address: React.FC<IComponentProps> = ({ value, onChange, provinces }) => {
  const [addressOptions, setAddressOptions] = useState<AddressOption[]>([]);
  const [selectedValue, setSelectedValue] = useState<string[]>([]);
  const [isLoadedDefaultOptions, setIsLoadedDefaultOptions] =
    useState<boolean>(false);

  const loadAddressOptions = async (selectedOptions: any) => {
    try {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      const { id } = targetOption;
      targetOption.loading = true;
      const { data = [] } = await fetchCodeDictionarys(
        CodeDictionarysEnum.REGION_CODE,
        {
          parentId: id,
        },
      );
      targetOption.loading = false;
      targetOption.children = data.map((i: AddressOption) => ({
        ...i,
        label: i.name,
        value: i.code,
        isLeaf: i.childrenNumber === 0,
      }));
      setAddressOptions([...addressOptions]);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   *
   */
  const init = async () => {
    if (isLoadedDefaultOptions) {
      return;
    }
    try {
      const [selectedProvinceCode, selectedCityCode] = value!;
      const { data: provinceItemData } = await fetchCodeDictionarys(
        CodeDictionarysEnum.REGION_CODE,
        {
          code: selectedProvinceCode,
          parentId: 0,
        },
      );
      const { data: cityItemData } = await fetchCodeDictionarys(
        CodeDictionarysEnum.REGION_CODE,
        {
          code: selectedCityCode,
          parentId: provinceItemData[0].id,
        },
      );
      const { data: cityData } = await fetchCodeDictionarys(
        CodeDictionarysEnum.REGION_CODE,
        {
          parentId: provinceItemData[0].id,
        },
      );
      const { data: regionData } = await fetchCodeDictionarys(
        CodeDictionarysEnum.REGION_CODE,
        {
          parentId: cityItemData[0].id,
        },
      );
      const options: AddressOption[] = provinces.map(
        (province: AddressOption) => {
          if (province.code === selectedProvinceCode) {
            return {
              ...province,
              children: cityData.map((city: AddressOption) => {
                if (city.code === selectedCityCode) {
                  return {
                    ...city,
                    label: city.name,
                    value: city.code,
                    isLeaf: city.childrenNumber === 0,
                    children: regionData.length
                      ? regionData.map((region: AddressOption) => ({
                          ...region,
                          label: region.name,
                          value: region.code,
                          isLeaf: true,
                        }))
                      : null,
                  };
                }
                return {
                  ...city,
                  label: city.name,
                  value: city.code,
                  isLeaf: city.childrenNumber === 0,
                };
              }),
            };
          }
          return province;
        },
      );
      setAddressOptions(options);
    } catch (error) {
      console.error(error);
    }
  };

  const onOptionChange = (options: any) => {
    if (options.length === 3 || options.length === 0) {
      if (onChange) {
        onChange(options);
      }
      setSelectedValue(options);
      setIsLoadedDefaultOptions(true);
    }
  };

  useEffect(() => {
    if (provinces?.length) {
      if (value?.length) {
        setSelectedValue(value);
        init();
      } else {
        setAddressOptions(provinces);
      }
    }
  }, [value, provinces]);

  return (
    <Cascader
      value={selectedValue}
      placeholder="请选择"
      options={addressOptions}
      loadData={loadAddressOptions}
      onChange={onOptionChange}
      changeOnSelect
    />
  );
};

export default Address;
