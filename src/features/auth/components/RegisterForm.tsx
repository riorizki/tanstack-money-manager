import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { registerSchema } from '../schema/register.schema'
import type { RegisterInput } from '../schema/register.schema'
import { useRegister } from '../query/auth.queries'

export function RegisterForm() {
  const { mutate: register, isPending, error } = useRegister()

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  function onSubmit(data: RegisterInput) {
    register(data)
  }

  return (
    <div className="mx-auto w-full max-w-[31rem]">
      <div className="mb-6 sm:mb-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-black/40">
          ■ New Account
        </p>
        <h1 className="mt-3 text-5xl font-extrabold leading-[0.92] tracking-[-0.03em] sm:text-7xl">
          Register.
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-black/50">
          Create your workspace access and start tracking your money flow.
        </p>
      </div>

      <div className="border-2 border-black bg-[#f6f6f6] shadow-[8px_8px_0_0_#000] sm:shadow-[10px_10px_0_0_#000]">
        <div className="border-b-2 border-black px-5 py-4 sm:px-7 sm:py-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/35">
            Account Setup Required
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6 border-b-2 border-black px-5 py-5 sm:space-y-7 sm:px-7 sm:py-7">
              {error && (
                <p className="border-2 border-black bg-black/5 px-3 py-2 text-xs font-semibold tracking-[0.02em] text-black">
                  {error.message}
                </p>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/45">
                      Full Name
                    </p>
                    <FormControl>
                      <input
                        type="text"
                        placeholder="Your name"
                        className="h-11 w-full border-0 border-b-2 border-black/35 bg-transparent px-0 text-base font-medium text-black outline-none transition-colors placeholder:text-black/25 focus:border-black"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/45">
                      Email
                    </p>
                    <FormControl>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="h-11 w-full border-0 border-b-2 border-black/35 bg-transparent px-0 text-base font-medium text-black outline-none transition-colors placeholder:text-black/25 focus:border-black"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/45">
                      Password
                    </p>
                    <FormControl>
                      <input
                        type="password"
                        placeholder="Minimum 8 characters"
                        className="h-11 w-full border-0 border-b-2 border-black/35 bg-transparent px-0 text-base font-medium text-black outline-none transition-colors placeholder:text-black/25 focus:border-black"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/45">
                      Confirm Password
                    </p>
                    <FormControl>
                      <input
                        type="password"
                        placeholder="Repeat password"
                        className="h-11 w-full border-0 border-b-2 border-black/35 bg-transparent px-0 text-base font-medium text-black outline-none transition-colors placeholder:text-black/25 focus:border-black"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-5 px-5 py-5 sm:px-7 sm:py-6">
              <button
                type="submit"
                disabled={isPending}
                className="h-12 w-full bg-black px-6 text-[11px] font-bold uppercase tracking-[0.28em] text-white transition-colors hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? 'Creating account...' : 'Create Account'}
              </button>

              <p className="text-center text-[11px] uppercase tracking-[0.16em] text-black/35">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-black transition-opacity hover:opacity-70"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>

      <div className="mt-7 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.3em] text-black/30">
        <span>Identity Provisioning</span>
        <span>00 — 02</span>
      </div>
    </div>
  )
}
