import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Alert from 'components/Shared/Alert';
import { IOption } from 'components/Shared/DropdownMenu';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import useMask from 'hooks/useMask';
import IOrderProducts from 'interfaces/models/orderProducts';
import DeleteIcon from 'mdi-react/DeleteIcon';
import ShowIcon from 'mdi-react/ShowIcon';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useCallbackObservable } from 'react-use-observable';
import { from } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import orderProductsService from 'services/orders';

interface IProps {
  order: IOrderProducts;
  onEdit: (order: IOrderProducts) => void;
  onDeleteComplete: () => void;
  onView: (request: IOrderProducts) => void;
}

const ListItemOrder = memo((props: IProps) => {
  const { order, onDeleteComplete, onView } = props;
  const { maskApply } = useMask('money', 0);
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleView = useCallback(() => {
    onView(order);
  }, [onView, order]);

  const [handleDelete] = useCallbackObservable(() => {
    return from(Alert.confirm('Deseja excluir o pedido?')).pipe(
      filter(ok => ok),
      tap(() => setLoading(true)),
      switchMap(() => orderProductsService.delete(order.id)),
      logError(),
      tap(
        () => {
          Toast.show('O pedido foi removido');
          setLoading(true);
          setDeleted(true);
          onDeleteComplete();
        },
        error => {
          setLoading(false);
          setError(error);
        }
      )
    );
  }, []);

  const handleDismissError = useCallback(() => setError(null), []);

  const options = useMemo<IOption[]>(() => {
    return [
      { text: 'Detalhes', icon: ShowIcon, handler: handleView },
      { text: 'Excluir', icon: DeleteIcon, handler: handleDelete }
    ];
  }, [handleDelete, handleView]);

  if (deleted) {
    return null;
  }

  let maskedValue = maskApply(order.price);
  return (
    <TableRow>
      <TableCell>{order.name}</TableCell>
      <TableCell>{order.description}</TableCell>
      <TableCell>{maskedValue}</TableCell>
      <TableCellActions options={options} loading={loading} error={error} onDismissError={handleDismissError} />
    </TableRow>
  );
});

export default ListItemOrder;
