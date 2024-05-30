'use client';

import React from 'react';
import { useFormState } from './useFormState'; // Ensure the correct path
import { createInvoice } from '@/app/lib/actions';

type Customer = {
  id: string;
  name: string;
};

interface CreateInvoiceFormProps {
  customers: Customer[];
}

const CreateInvoiceForm: React.FC<CreateInvoiceFormProps> = ({ customers }) => {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createInvoice, initialState);

  return (
    <form onSubmit={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="customer-error"
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer: Customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {state.errors?.customerId && state.errors.customerId.map((error, idx) => (
                <p className="mt-2 text-sm text-red-500" key={idx}>
                  {error}
                </p>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            placeholder="Enter USD amount"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="amount-error"
          />
          <div id="amount-error" aria-live="polite" aria-atomic="true">
            {state.errors?.amount && state.errors.amount.map((error, idx) => (
              <p className="mt-2 text-sm text-red-500" key={idx}>
                {error}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="status" className="mb-2 block text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            aria-describedby="status-error"
          >
            <option value="" disabled>
              Select status
            </option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status && state.errors.status.map((error, idx) => (
              <p className="mt-2 text-sm text-red-500" key={idx}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {state.message && (
          <div aria-live="polite" aria-atomic="true" className="mt-4 text-sm text-red-500">
            {state.message}
          </div>
        )}

        <button type="submit" className="mt-4 rounded bg-blue-500 px-4 py-2 text-white">
          Create Invoice
        </button>
      </div>
    </form>
  );
};

export default CreateInvoiceForm;
