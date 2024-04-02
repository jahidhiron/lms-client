import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CART_ITEMS_LOCAL_STORAGE_KEY } from '~/helpers/constants';
import { CourseModel } from '../course/course.model';
import { CartModel } from './cart.model';

type CartState = {
  items: CartModel[];
};

type CartAction = {
  addToCart: (_course: CourseModel) => CartModel;
  removeFromCart: (_ourseId: string) => void;
  clearCart: () => void;
};

// Create your store, which includes both state and (optionally) actions
const useCartStore = create(
  persist<CartState & CartAction>(
    (set, get) => ({
      items: [],

      addToCart(_course) {
        const isExists = get().items.find(
          (item) => item.course?._id == _course?._id
        );
        if (!isExists) {
          const cartItem: CartModel = {
            course: _course,
            _id: nanoid(),
            createdAt: dayjs().toString(),
            // @ts-ignore
            updatedBy: {},
            updatedAt: dayjs().toString(),
          };
          set({
            items: [...get().items, cartItem],
          });
          return cartItem;
        }
        return isExists;
      },
      removeFromCart(courseId) {
        set({
          items: get().items.filter((item) => item.course._id !== courseId),
        });
      },
      clearCart() {
        set({ items: [] });
      },
    }),
    {
      name: CART_ITEMS_LOCAL_STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useCartStore;
