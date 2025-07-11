import React from "react";
import { Table, Card, Badge, Button } from "react-bootstrap";

const GenericTable = ({
  title,
  icon: Icon,
  data = [],
  columns = [],
  actions = [],
  emptyMessage = "Aucune donnée trouvée",
  emptyIcon: EmptyIcon,
  tableStyle = "responsive hover",
  cardStyle = "shadow-sm",
  headerStyle = "bg-primary text-white py-2",
  showHeader = true,
  showCard = true,
  className = "",
  keyField = "id"
}) => {
  // Fonction pour rendre le contenu d'une cellule
  const renderCellContent = (item, column) => {
    if (column.render) {
      return column.render(item);
    }
    
    if (column.field) {
      const value = column.field.split('.').reduce((obj, key) => obj?.[key], item);
      return value ?? '-';
    }
    
    return '-';
  };

  const renderActions = (item) => {
    if (!actions || actions.length === 0) return null;

    return (
      <div className="d-flex gap-1 flex-wrap justify-content-center">
        {actions.map((action, index) => {
          if (action.condition && !action.condition(item)) {
            return null;
          }

          return (
            <Button
              key={index}
              variant={action.variant || "outline-primary"}
              size={action.size || "sm"}
              onClick={() => action.onClick(item)}
              title={action.title}
              className={action.className || ""}
            >
              {action.icon && <action.icon className={action.label ? "me-1" : ""} />}
              {action.label}
            </Button>
          );
        })}
      </div>
    );
  };

  const tableContent = (
    <Table className={`mb-0 align-middle ${tableStyle}`}>
      <thead className="table-light">
        <tr>
          {columns.map((column, index) => (
            <th 
              key={index} 
              style={column.width ? { width: column.width } : {}}
              className={column.className || ""}
            >
              {column.header}
            </th>
          ))}
          {actions && actions.length > 0 && (
            <th className="text-center">Actions</th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={item[keyField] || index}>
            {columns.map((column, colIndex) => (
              <td key={colIndex} className={column.cellClassName || ""}>
                {renderCellContent(item, column)}
              </td>
            ))}
            {actions && actions.length > 0 && (
              <td className="text-center">
                {renderActions(item)}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const emptyContent = (
    <div className="text-center py-4 text-muted">
      {EmptyIcon && <EmptyIcon size={40} className="mb-3" />}
      <div>{emptyMessage}</div>
    </div>
  );

  if (!showCard) {
    return (
      <div className={className}>
        {data.length === 0 ? emptyContent : tableContent}
      </div>
    );
  }

  return (
    <Card className={`${cardStyle} ${className}`}>
      {showHeader && title && (
        <Card.Header className={headerStyle}>
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">
              {Icon && <Icon className="me-2" />}
              {title} ({data.length})
            </h6>
          </div>
        </Card.Header>
      )}
      <Card.Body className="p-0">
        {data.length === 0 ? emptyContent : tableContent}
      </Card.Body>
    </Card>
  );
};

export default GenericTable;