import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import IOrderProducts from 'interfaces/models/orderProducts';
import React, { Fragment, memo } from 'react';

interface IProps {
  opened: boolean;
  request?: IOrderProducts;
  onClose: () => void;
}

const useStyle = makeStyles({
  content: {
    width: 400,
    maxWidth: 'calc(95vw - 50px)'
  },
  heading: {
    marginTop: 20,
    marginBottom: 10
  }
});

const DetailsOrder = memo((props: IProps) => {
  const classes = useStyle(props);

  return (
    <Dialog open={props.opened} disableBackdropClick disableEscapeKeyDown>
      <DialogTitle>Detalhes do Pedido</DialogTitle>
      <DialogContent className={classes.content}>
        <Fragment>
          <Grid container>
            <Grid item xs={4}>
              <strong>Nome</strong>
            </Grid>
            <Grid item xs={8}>
              {props.request ? props.request.name : ''}
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <strong>Descrição</strong>
            </Grid>
            <Grid item xs={8}>
              {props.request ? props.request.description : ''}
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <strong>Quantidade</strong>
            </Grid>
            <Grid item xs={8}>
              {props.request ? props.request.quantity : ''}
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <strong>Valor</strong>
            </Grid>
            <Grid item xs={8}>
              R$ {props.request ? props.request.price : ''}
            </Grid>
          </Grid>
        </Fragment>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
});

export default DetailsOrder;
