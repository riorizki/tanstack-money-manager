import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useLogin } from '../../query/auth.queries'
import type { LoginInput } from '../../schema/login.schema'
import { loginSchema } from '../../schema/login.schema'

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin()

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  function onSubmit(data: LoginInput) {
    login(data)
  }

  return (
    <section
      aria-labelledby="login-form-title"
      className="mx-auto w-full max-w-124"
    >
      <header className="mb-6 sm:mb-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-black/40">
          ■ Authentication Required
        </p>
        <h1
          id="login-form-title"
          className="mt-3 text-5xl font-extrabold leading-[0.92] tracking-[-0.03em] sm:text-7xl"
        >
          Sign in.
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-black/50">
          Enter your credentials to continue and access your workspace.
        </p>
      </header>

      <article className="border-2 border-black bg-[#f6f6f6] shadow-[8px_8px_0_0_#000] sm:shadow-[10px_10px_0_0_#000]">
        <header className="border-b-2 border-black px-5 py-4 sm:px-7 sm:py-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/35">
            Money Manager Access
          </p>
        </header>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6 border-b-2 border-black px-5 py-5 sm:space-y-7 sm:px-7 sm:py-7">
              {error && (
                <p
                  role="alert"
                  className="border-2 border-black bg-black/5 px-3 py-2 text-xs font-semibold tracking-[0.02em] text-black"
                >
                  {error.message}
                </p>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/45">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="h-11 w-full rounded-none border-0 border-b-2 border-black/35 bg-transparent px-0 text-base font-medium text-black shadow-none transition-colors placeholder:text-black/25 focus-visible:border-black focus-visible:ring-0"
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
                    <FormLabel className="text-[11px] font-bold uppercase tracking-[0.22em] text-black/45">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="h-11 w-full rounded-none border-0 border-b-2 border-black/35 bg-transparent px-0 text-base font-medium text-black shadow-none transition-colors placeholder:text-black/25 focus-visible:border-black focus-visible:ring-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <footer className="space-y-5 px-5 py-5 sm:px-7 sm:py-6">
              <Button
                type="submit"
                disabled={isPending}
                className="h-12 w-full rounded-none border border-black bg-black px-6 text-[11px] font-bold uppercase tracking-[0.28em] text-white shadow-none transition-colors hover:bg-black/85 hover:text-white"
              >
                {isPending ? 'Signing in...' : 'Sign In'}
              </Button>

              <p className="text-center text-[11px] uppercase tracking-[0.16em] text-black/35">
                Need an account?{' '}
                <Link
                  to="/register"
                  className="font-bold text-black transition-opacity hover:opacity-70"
                >
                  Register
                </Link>
              </p>
            </footer>
          </form>
        </Form>
      </article>

      <footer className="mt-7 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.3em] text-black/30">
        <span>Secure Session</span>
        <span>00 — 01</span>
      </footer>
    </section>
  )
}
