import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Order, OrderStatus, OrderUpdateAction, OrdersResponse } from '../types/orders';

interface UseOrdersOptions {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}

export function useOrders({ page = 1, limit = 10, status }: UseOrdersOptions = {}) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Fetch orders
  const {
    data,
    isLoading,
    refetch
  } = useQuery<OrdersResponse>({
    queryKey: ['orders', { page, limit, status }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status })
      });

      const response = await fetch(`/api/orders?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return response.json();
    }
  });

  // Update order
  const updateOrder = useMutation({
    mutationFn: async ({ orderId, action }: { orderId: string; action: OrderUpdateAction }) => {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update order');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  // Delete order
  const deleteOrder = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete order');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  // Add item to order
  const addOrderItem = useMutation({
    mutationFn: async ({
      orderId,
      productId,
      variantId,
      quantity
    }: {
      orderId: string;
      productId: string;
      variantId?: string;
      quantity: number;
    }) => {
      const response = await fetch(`/api/orders/${orderId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, variant_id: variantId, quantity })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add item to order');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  // Update order item
  const updateOrderItem = useMutation({
    mutationFn: async ({
      orderId,
      itemId,
      quantity
    }: {
      orderId: string;
      itemId: string;
      quantity: number;
    }) => {
      const response = await fetch(`/api/orders/${orderId}/items`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: itemId, quantity })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update order item');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  // Remove order item
  const removeOrderItem = useMutation({
    mutationFn: async ({ orderId, itemId }: { orderId: string; itemId: string }) => {
      const response = await fetch(`/api/orders/${orderId}/items?itemId=${itemId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove order item');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  // Generate test orders
  const generateTestOrders = useMutation({
    mutationFn: async (count: number = 10) => {
      const response = await fetch('/api/test/generate-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate test orders');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  return {
    orders: data?.orders || [],
    pagination: {
      page: data?.page || 1,
      limit: data?.limit || 10,
      total: data?.total || 0
    },
    isLoading,
    error,
    refetch,
    updateOrder: updateOrder.mutate,
    deleteOrder: deleteOrder.mutate,
    addOrderItem: addOrderItem.mutate,
    updateOrderItem: updateOrderItem.mutate,
    removeOrderItem: removeOrderItem.mutate,
    generateTestOrders: generateTestOrders.mutate,
    isUpdating: updateOrder.isPending,
    isDeleting: deleteOrder.isPending,
    isAddingItem: addOrderItem.isPending,
    isUpdatingItem: updateOrderItem.isPending,
    isRemovingItem: removeOrderItem.isPending,
    isGeneratingTest: generateTestOrders.isPending
  };
} 