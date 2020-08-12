import React from "react";
import useAutocomplete from "@material-ui/lab/useAutocomplete";
import NoSsr from "@material-ui/core/NoSsr";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled("div")`
  width: 100%;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 4px;
  max-width: 200px;
  padding: 1px;
  display: flex;
  color: rgba(0, 0, 0, 0.85);
  flex-wrap: wrap;

  &:hover {
    border-color: #40a9ff;
  }

  &.focused {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    font-size: 14px;
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`;

const Tag = styled(({ label, onDelete, ...props }) => (
  <div {...props}>
    <span>{label}</span>
    <CloseIcon onClick={onDelete} />
  </div>
))`
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: #40a9ff;
    background-color: #e6f7ff;
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`;

const Listbox = styled("ul")`
  width: 300px;
  margin: 2px 0 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.85);
  position: absolute;
  list-style: none;
  background-color: #fff;
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected="true"] {
    background-color: #fafafa;
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li[data-focus="true"] {
    background-color: #e6f7ff;
    cursor: pointer;

    & svg {
      color: #000;
    }
  }
`;

const getLabel = (option) => {
  if (!option) return;
  const from = option.inputs[0].address;
  const to = option.outputs.reduce(
    (to, output) => {
      if (output.address !== from && output.address !== undefined) {
        to.address = output.address;
        to.amount += output.amount;
      }

      return to;
    },
    { address: "", amount: 0 }
  );
  return (
    to.amount +
    " from ..." +
    from.substr(from.length - 3) +
    " to ..." +
    to.address.substr(to.address.length - 3)
  );
};

export default function TransactionSelect(props) {
  const { options, onChange } = props;
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: "multi-select",
    multiple: true,
    options: options,
    onChange: (e, value) => onChange(e, value),
    getOptionLabel: getLabel,
  });

  return (
    <NoSsr>
      <div>
        <div {...getRootProps()}>
          <Label {...getInputLabelProps()}>UNVALIDATED TRANSACTIONS</Label>
          <InputWrapper ref={setAnchorEl} className={focused ? "focused" : ""}>
            {value.map((option, index) => (
              <Tag label={getLabel(option)} {...getTagProps({ index })} />
            ))}

            <input {...getInputProps()} />
          </InputWrapper>
        </div>
        {groupedOptions.length > 0 ? (
          <Listbox {...getListboxProps()}>
            {groupedOptions.map((option, index) => (
              <li {...getOptionProps({ option, index })}>
                <span>{getLabel(option)}</span>
                <CheckIcon fontSize="small" />
              </li>
            ))}
          </Listbox>
        ) : null}
      </div>
    </NoSsr>
  );
}
