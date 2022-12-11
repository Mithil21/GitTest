import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, Observable } from 'rxjs';
import { LoginComponent } from '../auth/login/login.component';
import { KetoComponent } from '../keto/keto.component';
import { KetopageComponent } from '../ketopage/ketopage.component';
import { CartService } from '../services/cart.service';
import { KetopageService } from '../services/food/ketopage.service';
import { VeganPageService } from '../services/food/vegan-page.service';
import { cart } from '../shared/models/cart';
import { CartItem } from '../shared/models/cartItem';
import { Keto } from '../shared/models/keto';
import { Vegan } from '../shared/models/vegan';
import { CartPayload } from './cart-payload';
import { Nutrition } from './nutrition';
import { cartIntr } from './temp-cart-intr';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CartPageComponent implements OnInit {
  cart = {} as cart;
  ketocompt = {} as KetopageComponent;
  cartpayload = {} as CartPayload;
  public today = new Date();
  cartIntr = {} as cartIntr;
  // public ketoAdd = {} as  Keto
  public login = {} as LoginComponent;
  public userId!: number;
  public dd = String(this.today.getDate()).padStart(2, '0');
  mm = String(this.today.getMonth() + 1).padStart(2, '0'); //January is 0!
  yyyy = this.today.getFullYear();
  today1 = this.mm + '/' + this.dd + '/' + this.yyyy;
  constructor(private cartService: CartService, private router: Router, private location: Location,
    private ar: ActivatedRoute,private change:ChangeDetectorRef,
    private ketoser: KetopageService, @Inject(Keto) private ketoAdd: Keto, private cgf: ChangeDetectorRef,
    private veganService: VeganPageService) {
    this.setCart();
  }

  public vegan = {} as Vegan
  public nutri = new Nutrition();


  public nutrition = new Nutrition();
  ngOnInit(): void {

  }
  public cal = 0;
  public prot = 0;
  public carbs = 0;
  public fat = 0;
  setCart() {
    this.cart = this.cartService.getCart();
    this.cartpayload.items = this.cart.items;
    this.cartpayload.total = this.cart.totalPrice;
    this.cartpayload.orderDate = this.today1;

    // cartIntr
    this.cartIntr.items = this.cart.items;
    this.cartIntr.total = this.cart.totalPrice;
    this.cartIntr.orderDate = this.today1;
    this.cartIntr.userId = this.cartService.userId;

  }

  async removeFromCart(cartItem: CartItem) {
    let keto = new Keto();
    let nutri_remove = new Nutrition();
    this.cartService.removeFromCart(cartItem.food.id);
    //this.setCart();
    let id = this.cart.items.filter(num => num.food.id > 20);
    console.log(cartItem.food.id);
    console.log(id[0]);
    this.ar.params.subscribe((params) => {
      if (cartItem.food.id>20 && cartItem.food.id<35) {
        console.log("const");
        keto = this.ketoser.getKetoById(cartItem.food.id);
        this.nutri = this.cartService.removeDetails(keto,this.nutri);
      }else if(cartItem.food.id>34){
        nutri_remove = this.veganService.getVeganById(cartItem.food.id);
        this.nutri = this.cartService.removeDetails(nutri_remove,this.nutri);
      }
    })
    this.nutrition = this.nutri;
  }
  changeQuantity(cartItem: CartItem, quantityInString: string) {
    const quantity = parseInt(quantityInString);
    this.cartService.changeQuantity(cartItem.food.id, quantity);
    this.setCart();
  }
  confirmOrder() {
    this.cartService.confirmOrder(this.cartIntr).subscribe(
      (response: CartPayload) => {
        console.log(response);
        alert(response);
        this.router.navigateByUrl("/home");
      }, (error: HttpErrorResponse) => {
        alert(error);
      }
    )
  }


 async displayNutrition(): Promise<boolean> {
    const id = this.cart.items.filter(num => num.food.id > 20);
    if (id === null || id === undefined) {
      return false;
    }
    console.log(id);
    if (id != null && id != undefined) {
      for (let i = 0; i < id.length; i++) {
        this.ar.params.subscribe((params) => {
          if (id[i].food.id > 20 && id[i].food.id < 35) {
            this.ketoAdd = this.ketoser.getKetoById(id[i].food.id);
            this.nutri = this.cartService.addDetails(this.ketoAdd, this.nutri);
          } else if (id[i].food.id > 34) {
            this.vegan = this.veganService.getVeganById(id[i].food.id);
            console.log(this.vegan);
            this.nutri = this.cartService.addDetails(this.vegan, this.nutri);
            console.log(this.nutri);
          }
        })
      }

      this.nutrition = this.nutri;
    }
    return true;
  }
}
