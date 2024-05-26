import { SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import { CompoundedComponent } from "antd/es/float-button/interface";

interface InputProps {
  key: string;
  name: string;
  label: string;
}

interface SelectItemProps {
  value: string;
  label: string;
}

interface SelectProps extends InputProps {
  options?: SelectItemProps[];
}

interface QueryBuilderProps {
  populate?: string[];
  regex?: InputProps[];
  exact?: SelectProps[];
  sort?: SelectItemProps[];
  setQueryString: React.Dispatch<React.SetStateAction<string>>;
}

const QueryBuilder: React.FC<QueryBuilderProps> = ({
  regex,
  exact,
  sort,
  populate,
  setQueryString,
}) => {
  const buildQueryString = (
    value: Record<string, string | number | undefined>
  ) => {
    console.log(value);
    const entries = Object.entries(value).filter(
      (entry) => entry[1] !== undefined
    );
    const regexEntries = entries.filter((entry) =>
      entry[0].startsWith("regex-")
    );
    const exactEntries = entries.filter((entry) =>
      entry[0].startsWith("exact-")
    );

    let result: string = "";
    regexEntries?.forEach((regexEntry) => {
      const key = regexEntry[0];
      const value = regexEntry[1];
      result += `${key.split("regex-")[1]}=/^${value}/&`;
    });

    exactEntries.forEach((exactEntry) => {
      const key = exactEntry[0];
      const value = exactEntry[1];
      if (value !== "") result += `${key.split("exact-")[1]}=/${value}/&`;
    });

    const sort = value["sort"];
    if (sort) {
      const order = value["sort-order"];
      if (order) {
        result += `sort=${order === 1 ? "" : "-"}${sort}`;
      }
    }

    if (populate && populate.length > 0) {
      result += `&populate=`;
      populate?.forEach((item) => (result += `${item},`));
      result = result.slice(0, -1);
    }

    setQueryString(result);
    console.log(result);
  };

  const getInitialValues = () => {
    let initialiValues: Record<string, any> = {};
    if (exact) {
      exact?.forEach((item) => {
        if (item?.options) {
          initialiValues[`exact-${item?.name}`] = item?.options[0]?.value;
        }
      });
    }
    if (sort && sort.length > 0) {
      initialiValues["sort"] = sort[0].value;
    }
    initialiValues["sort-order"] = 1;
    return initialiValues;
  };

  return (
    <Form
      layout="inline"
      onFinish={(value) => buildQueryString(value)}
      initialValues={getInitialValues()}
    >
      {regex &&
        regex?.map((item, index) => (
          <Form.Item
            key={item.key}
            name={`regex-${item.name}`}
            label={item.label}
          >
            <Input />
          </Form.Item>
        ))}
      {exact &&
        exact?.map((item) => (
          <Form.Item
            key={item.key}
            name={`exact-${item.name}`}
            label={item.label}
          >
            {item.options && item.options.length > 0 ? (
              <Select
                options={[
                  ...item.options,
                  {
                    value: "",
                    label: "ALL",
                  },
                ]}
              ></Select>
            ) : (
              <Input></Input>
            )}
          </Form.Item>
        ))}
      {sort && (
        <>
          <Form.Item key="sort" name="sort" label="Sort by">
            <Select options={sort} />
          </Form.Item>
          <Form.Item key="sort-order" name="sort-order" label="Order">
            <Select
              options={[
                {
                  value: 1,
                  label: "ASCENDING",
                },
                {
                  value: -1,
                  label: "DESCENDING",
                },
              ]}
            />
          </Form.Item>
        </>
      )}

      <Form.Item>
        <Button icon={<SearchOutlined />} type="primary" htmlType="submit">
          Search
        </Button>
      </Form.Item>
    </Form>
  );
};

export default QueryBuilder;
