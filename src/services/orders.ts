import IOrderProducts from 'interfaces/models/orderProducts';
import { IPaginationParams, IPaginationResponse } from 'interfaces/pagination';
import { Observable } from 'rxjs';

import apiService, { ApiService } from './api';

export class OrderProductsService {
  constructor(private apiService: ApiService) {}

  public list(params: IPaginationParams): Observable<IPaginationResponse<IOrderProducts>> {
    return this.apiService.get('/orderproducts', params);
  }

  public save(model: Partial<IOrderProducts>): Observable<IOrderProducts> {
    return this.apiService.post('/orderproducts', { ...model, price: parseFloat(String(model.price)) });
  }

  public delete(id: number): Observable<void> {
    return this.apiService.delete(`/orderproducts/${id}`);
  }
}

const orderProductsService = new OrderProductsService(apiService);
export default orderProductsService;
