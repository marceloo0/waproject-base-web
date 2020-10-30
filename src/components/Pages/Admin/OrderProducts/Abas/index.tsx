// import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import Toolbar from 'components/Layout/Toolbar';
import ToolbarTabs from 'components/Layout/ToolbarTabs';
import CardLoader from 'components/Shared/CardLoader';
import EmptyAndErrorMessages from 'components/Shared/Pagination/EmptyAndErrorMessages';
import SearchField from 'components/Shared/Pagination/SearchField';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import TableCellSortable from 'components/Shared/Pagination/TableCellSortable';
import TablePagination from 'components/Shared/Pagination/TablePagination';
import TableWrapper from 'components/Shared/TableWrapper';
import usePaginationObservable from 'hooks/usePagination';
import IOrderProducts from 'interfaces/models/orderProducts';
import RefreshIcon from 'mdi-react/RefreshIcon';
import React, { Fragment, memo, useCallback, useState } from 'react';
import orderProductsService from 'services/orders';

import DetailsOrder from './DetailsOrder';
import FormOrder from './FormOrder';
import ListItem from './ListItemOrder';

interface ITabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: ITabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    'id': `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

// import { useHistory } from 'react-router-dom';
const OrderListPage = memo(() => {
  // const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  // const history = useHistory();
  const [showOpened, setShowOpened] = useState(false);
  const [formOpened, setFormOpened] = useState(false);
  const [current, setCurrent] = useState<IOrderProducts>();

  const [params, mergeParams, loading, data, error, , refresh] = usePaginationObservable(
    params => orderProductsService.list(params),
    { orderBy: 'name', orderDirection: 'asc' },
    []
  );

  const { total, results } = data || ({ total: 0, results: [] } as typeof data);

  const handleCreate = useCallback(() => {
    setCurrent(null);
    setFormOpened(true);
  }, []);

  const handleShow = useCallback((current: IOrderProducts) => {
    setCurrent(current);
    setShowOpened(true);
  }, []);

  const handleEdit = useCallback((current: IOrderProducts) => {
    setCurrent(current);
    setFormOpened(true);
  }, []);

  const formCancel = useCallback(() => setFormOpened(false), []);
  const viewClose = useCallback(() => setShowOpened(false), []);

  const formCallback = useCallback(() => {
    setFormOpened(false);
    setCurrent(null);
    refresh();
  }, [refresh]);

  return (
    <Fragment>
      <Toolbar title='Pedidos' />
      <ToolbarTabs>
        <Tabs value={value} onChange={handleChange} color='primary'>
          <Tab label='Listar' {...a11yProps(0)} />
          <Tab label='Novo' {...a11yProps(1)} onClick={handleCreate} />
        </Tabs>
      </ToolbarTabs>
      <DetailsOrder opened={showOpened} request={current} onClose={viewClose} />
      <TabPanel value={value} index={1}>
        <Card>
          <FormOrder opened={formOpened} order={current} onComplete={formCallback} onCancel={formCancel} />
        </Card>
      </TabPanel>

      <TabPanel value={value} index={0}>
        <Card>
          <CardLoader show={loading} />

          <CardContent>
            <Grid container justify='space-between' alignItems='center' spacing={2}>
              <Grid item xs={12} sm={6} lg={4}>
                <SearchField paginationParams={params} onChange={mergeParams} />
              </Grid>

              <Grid item xs={12} sm={'auto'}>
                {/* <Button fullWidth variant='contained' color='primary' onClick={handleCreate}>
                  Adicionar
                </Button> */}
              </Grid>
            </Grid>
          </CardContent>

          {/* <Button fullWidth variant='contained' color='primary' onClick={handleCreate}>
            Adicionar
          </Button> */}
          <TableWrapper minWidth={500}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellSortable paginationParams={params} disabled={loading} onChange={mergeParams} column='name'>
                    Nome
                  </TableCellSortable>
                  <TableCellSortable
                    paginationParams={params}
                    disabled={loading}
                    onChange={mergeParams}
                    column='description'
                  >
                    Descrição
                  </TableCellSortable>
                  <TableCellActions>
                    <IconButton disabled={loading}>
                      <RefreshIcon />
                    </IconButton>
                  </TableCellActions>
                </TableRow>
              </TableHead>
              <TableBody>
                <EmptyAndErrorMessages
                  colSpan={3}
                  error={error}
                  loading={loading}
                  hasData={results.length > 0}
                  onTryAgain={refresh}
                />
                {results.map(order => (
                  <ListItem
                    key={order.id}
                    order={order}
                    onView={handleShow}
                    onEdit={handleEdit}
                    onDeleteComplete={refresh}
                  />
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
          <TablePagination total={total} disabled={loading} paginationParams={params} onChange={mergeParams} />
        </Card>
      </TabPanel>
    </Fragment>
  );
});

export default OrderListPage;
