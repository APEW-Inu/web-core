import usePathRewrite, { use404Rewrite } from '@/hooks/usePathRewrite'
import { act, renderHook } from '@/tests/test-utils'

// mock window history replaceState
Object.defineProperty(window, 'history', {
  writable: true,
  value: {
    replaceState: jest.fn(),
  },
})

describe('usePathRewrite', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should rewrite the path if there is ?safe= in the query', () => {
    renderHook(() => usePathRewrite(), {
      routerProps: {
        pathname: '/balances',
        query: {
          safe: 'rin:0x0000000000000000000000000000000000000000',
        },
        asPath: '/balances?safe=rin:0x0000000000000000000000000000000000000000',
        replace: jest.fn(),
      },
    })

    expect(history.replaceState).toHaveBeenCalledWith(
      undefined,
      '',
      '/rin:0x0000000000000000000000000000000000000000/balances',
    )
  })

  it('should rewrite the root path', () => {
    renderHook(() => usePathRewrite(), {
      routerProps: {
        pathname: '/',
        query: {
          safe: 'rin:0x0000000000000000000000000000000000000000',
        },
        asPath: '/?safe=rin:0x0000000000000000000000000000000000000000',
        replace: jest.fn(),
      },
    })

    expect(history.replaceState).toHaveBeenCalledWith(undefined, '', '/rin:0x0000000000000000000000000000000000000000/')
  })

  it('should not rewrite the path if there is no ?safe= in the query', () => {
    renderHook(() => usePathRewrite(), {
      routerProps: {
        pathname: '/welcome',
        query: {},
        asPath: '/welcome',
        replace: jest.fn(),
      },
    })

    expect(history.replaceState).not.toHaveBeenCalled()
  })

  it('should preserve other query params in the URL', () => {
    renderHook(() => usePathRewrite(), {
      routerProps: {
        pathname: '/hello',
        query: {
          safe: 'rin:0x0000000000000000000000000000000000000000',
          hey: 'hi:there',
          count: ['1', '2', '3'],
        },
        asPath: '/hello?safe=rin:0x0000000000000000000000000000000000000000&hey=hi%3Athere&count=1&count=2&count=3',
        replace: jest.fn(),
      },
    })

    expect(history.replaceState).toHaveBeenCalledWith(
      undefined,
      '',
      '/rin:0x0000000000000000000000000000000000000000/hello?hey=hi%3Athere&count=1&count=2&count=3',
    )
  })

  it('should preserve query params when &safe= is in the middle', () => {
    renderHook(() => usePathRewrite(), {
      routerProps: {
        pathname: '/hello',
        query: {
          safe: 'rin:0x0000000000000000000000000000000000000000',
          hi: 'hello',
          count: '1',
        },
        asPath: '/hello?hi=hello&safe=rin:0x0000000000000000000000000000000000000000&count=1',
        replace: jest.fn(),
      },
    })

    expect(history.replaceState).toHaveBeenCalledWith(
      undefined,
      '',
      '/rin:0x0000000000000000000000000000000000000000/hello?hi=hello&count=1',
    )
  })
})

describe('useQueryRewrite', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not redirect if there is no Safe address in the path', async () => {
    const { result } = renderHook(() => use404Rewrite())
    expect(result.current).toBe(false)
  })

  it('should redirect if there is a Safe address in the path', async () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        pathname: '/rin:0x0000000000000000000000000000000000000000/balances',
      },
    })

    const { result } = renderHook(() => use404Rewrite())
    expect(result.current).toBe(true)
    await act(() => Promise.resolve())
    expect(result.current).toBe(true)
  })
})
