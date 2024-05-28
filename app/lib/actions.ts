import { signIn } from 'next-auth/react'; // Ensure you have next-auth/react installed and correctly imported
import { sql } from '@vercel/postgres';
import { z } from 'zod';
import { redirect } from 'next/navigation'; // Corrected import

// Validation Schemas
const CreateInvoice = z.object({
  customerId: z.string().nonempty({ message: 'Please select a customer.' }),
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], { invalid_type_error: 'Please select an invoice status.' }), // Corrected parameter
});

const UpdateInvoice = CreateInvoice.extend({
  id: z.string(),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// Authenticate Function
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const res = await signIn('credentials', {
      redirect: false,
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (res?.error) {
      if (res.error === 'CredentialsSignin') {
        return 'Invalid credentials.';
      } else {
        return 'Something went wrong.';
      }
    }
  } catch (error) {
    if (error instanceof Error) { // Handle the error as an instance of Error
      switch (error.message) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

// Create Invoice Function
export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: parseFloat(formData.get('amount') as string),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Use a suitable method to revalidate the path if needed
  // revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// Update Invoice Function
export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: parseFloat(formData.get('amount') as string),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  // Use a suitable method to revalidate the path if needed
  // revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
