import { Injectable } from '@angular/core';
import { cart } from '../shared/models/cart';
import { Foods } from 'src/app/shared/models/food';
import { CartItem } from '../shared/models/cartItem';
import { CartPayload } from '../cart-page/cart-payload';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { cartIntr } from '../cart-page/temp-cart-intr';
import { Keto } from '../shared/models/keto';
import { KetoPage } from '../shared/models/ketopage';
import { Nutrition } from '../cart-page/nutrition';
import { keyframes } from '@angular/animations';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private httpClient: HttpClient) { }
  private url= "http://localhost:8080/";
private cart: cart = new cart();
addToCart(food :Foods):void{
  let cartItem = this.cart.items.find(item => item.food.id === food.id)
  if(cartItem){
    this.changeQuantity(food.id, cartItem.quantity+1)
    return;
  }
  else{
    this.cart.items.push(new CartItem(food))
  }
}

addDetails(keto :any, nutrition:Nutrition) : Nutrition{
  let cal:number=nutrition.calories;
  let fat:number=nutrition.fat;
  let prot:number=nutrition.protein;
  let carbs:number=nutrition.carbs;

  const nutri = new Nutrition();
  cal += keto.calories;
  fat += keto.fat;
  prot += keto.protein;
  carbs += keto.carbs;


  nutri.calories = cal;
  nutri.carbs = carbs;
  nutri.fat = fat;
  nutri.protein = prot;
  return nutri;
}


removeDetails(keto:any, nutrition:Nutrition):Nutrition{
  let cal:number=nutrition.calories;
  let fat:number=nutrition.fat;
  let prot:number=nutrition.protein;
  let carbs:number=nutrition.carbs;

  const nutri = new Nutrition();
  cal -= keto.calories;
  fat -= keto.fat;
  prot -= keto.protein;
  carbs -= keto.carbs;


  nutri.calories = cal;
  nutri.carbs = carbs;
  nutri.fat = fat;
  nutri.protein = prot;
  return nutri;
}

displayNutrition(keto:Keto):Keto{
  let size = Object.keys(keto).length;
  if(size>0){
return keto;
  }
  return keto;
}
removeFromCart(foodId: number):void{
  this.cart.items = this.cart.items.filter(item => item.food.id != foodId)
}
changeQuantity( foodId: number,quantity:number ){
  let cartItem = this.cart.items.find(item => item.food.id === foodId);
if(!cartItem) return;
cartItem.quantity = quantity;
}
getCart(): cart{
  return this.cart;
}
public confirmOrder(cart:cartIntr): Observable<any>{
  // cart: CartPayload
return this.httpClient.post<any>(`${this.url}api/cart/store`,cart);
}

public getId(userName:string): Observable<any>{
  // cart: CartPayload
return this.httpClient.post<any>(`${this.url}api/cart/userId`,userName);
}
public userId!:number;
}
