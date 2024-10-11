import { OrderController } from "@/modules/ui/orders/controller/OrderController"
import OrderView from "@/modules/ui/orders/view/OrderView"

const OrdersPage = () => {
  return (
    <OrderController>
      <OrderView/>
    </OrderController>
  )
}   

export default OrdersPage;