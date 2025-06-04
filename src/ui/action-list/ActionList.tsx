import { HeaderTitle, ActionButton, ActionLink } from './ActionElements';

interface ActionListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  header?: { title: React.ReactNode; action?: React.ReactNode };
  footer?: string;
  placeholder?: React.ReactNode;
}

function ActionList<T>({ data, renderItem, keyExtractor, header, footer, placeholder }: ActionListProps<T>) {
  return (
    <div className="space-y-2">
      {header && (
        <div className="flex justify-between items-center bg-transparent">
          <HeaderTitle>{header.title}</HeaderTitle>
          {header.action}
        </div>
      )}
      {data.length ? (
        <>
          <div className={`rounded-lg bg-white border border-gray-200 overflow-hidden`}>
            {data.map((item, index) => (
              <div key={keyExtractor(item, index)} className="bg-transparent">
                {renderItem(item, index)}
              </div>
            ))}
          </div>
          {footer && (
            <div className="px-2">
              <span className="text-xs">{footer}</span>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-600">{placeholder}</p>
      )}
    </div>
  );
}

ActionList.Button = ActionButton;
ActionList.Link = ActionLink;
ActionList.HeaderTitle = HeaderTitle;

export default ActionList;
