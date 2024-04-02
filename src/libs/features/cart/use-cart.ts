import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { queryClient } from '~/helpers/config';
import useAuth from '../auth/use-auth';
import { CourseModel } from '../course/course.model';
import {
  addCartAPI,
  deleteCartAPI,
  getCartAPI,
  getCartsAPI,
  updateCartAPI,
} from './cart.api';
import {
  AddUpdateCartModel,
  AddUpdateCartModelResp,
  CartModel,
  DeleteCartModelResp,
  GetCartProps,
  ListCartsProps,
} from './cart.model';
import useCartStore from './use-cart.store';

const QUERY_KEY = 'carts';

export const useCarts = ({ page = 1, size = 10 }: ListCartsProps) => {
  const { isAuthenticated } = useAuth();
  const localItems = useCartStore((state) => state.items);
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, page, size],
    queryFn: ({ queryKey }) =>
      getCartsAPI({
        page: queryKey.at(1) as number,
        size: queryKey.at(2) as number,
      }),
    enabled: isAuthenticated,
  });

  const carts = useMemo(
    () => ({
      carts: !isAuthenticated ? localItems : data?.data?.addToCards || [],
      current_page: page,
      total_page: data?.data?.totalPage || 0,
      row_per_page: size || 10,
      total_carts: data?.data?.totalItem || 0,
    }),
    [data, page, isAuthenticated, localItems]
  );

  return { ...carts, ...others };
};

export const useCart = ({ id }: GetCartProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: ({ queryKey }) =>
      getCartAPI({ id: queryKey.at(-1) as GetCartProps['id'] }),
    enabled: !!id,
  });

  const cart = useMemo(() => data?.data.addToCard, [data]);

  return { cart, ...others };
};

export const useCartMutations = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const page = parseInt(router?.query?.page as string) || 1;
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const addCartMutation = useMutation({
    mutationFn: (data: [AddUpdateCartModel, CourseModel]) => {
      if (isAuthenticated) {
        return addCartAPI(data[0]);
      } else {
        return new Promise<AddUpdateCartModelResp>((res) => {
          const cartItem: CartModel = addToCart(data[1]);
          res({
            message: 'course added to cart',
            cart: {
              status: 'success',
              message: 'course added to cart',
              code: 201,
              data: { addToCard: cartItem },
            },
          });
        });
      }
    },
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const addNewCart = async (data: [AddUpdateCartModel, CourseModel]) => {
    return addCartMutation.mutateAsync(data);
  };

  const updateCartMutation = useMutation({
    mutationFn: (vars: never[]) => updateCartAPI(vars[0], vars[1]),
    onSuccess(data, variables) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.setQueryData([QUERY_KEY, variables[0]], data);
    },
  });
  const updateCart = async (id: string, data: AddUpdateCartModel) => {
    return updateCartMutation.mutateAsync([id as never, data as never]);
  };

  const deleteCartMutation = useMutation({
    mutationFn: (data: [string, CourseModel]) => {
      if (isAuthenticated) {
        return deleteCartAPI(data[0]);
      } else {
        return new Promise<DeleteCartModelResp>((res) => {
          removeFromCart(data[1]?._id);
          res({
            message: 'course removed from cart',
          });
        });
      }
    },
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const deleteCart = async (id: [string, CourseModel]) => {
    return deleteCartMutation.mutateAsync(id);
  };

  return { addNewCart, updateCart, deleteCart };
};
