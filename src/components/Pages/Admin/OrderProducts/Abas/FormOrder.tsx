import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from 'components/Shared/Fields/Text';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import { useFormikObservable } from 'hooks/useFormikObservable';
import IOrderProducts from 'interfaces/models/orderProducts';
import React, { Fragment, memo } from 'react';
import { tap } from 'rxjs/operators';
import orderProductsService from 'services/orders';
import * as yup from 'yup';

const useStyle = makeStyles({
  content: {
    width: 600,
    maxWidth: 'calc(95vw - 50px)'
  },
  heading: {
    marginTop: 20,
    marginBottom: 10
  }
});

interface IProps {
  opened: boolean;
  order?: IOrderProducts;
  onComplete: (orderProducts: IOrderProducts) => void;
  onCancel: () => void;
}

const validationSchema = yup.object().shape({
  name: yup.string().required().min(3).max(500),
  description: yup.string().required().min(3).max(1000),
  quantity: yup.number().required().min(1),
  price: yup.number().required()
});

const FormOrder = memo((props: IProps) => {
  const classes = useStyle(props);

  const formik = useFormikObservable<IOrderProducts>({
    initialValues: { name: '', description: '', quantity: 1, price: 0 },
    validationSchema,
    onSubmit(model) {
      return orderProductsService.save(model).pipe(
        tap(order => {
          Toast.show(`O pedido "${order.name}" foi salvo`);
          props.onComplete(order);
        }),
        logError(true)
      );
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogTitle>Novo Pedido</DialogTitle>
      <DialogContent className={classes.content}>
        <Fragment>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label='Nome' name='name' formik={formik} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Descricao' name='description' formik={formik} />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label='Quantidade' name='quantity' formik={formik} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Valor' name='price' mask='money' formik={formik} />
            </Grid>
          </Grid>
        </Fragment>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>Cancelar</Button>
        <Button color='primary' variant='contained' type='submit' disabled={formik.isSubmitting}>
          Salvar
        </Button>
      </DialogActions>
    </form>
  );
});

export default FormOrder;
