'use client';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { ReactNode, Suspense, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import {
  ClusterChecker,
  ClusterUiSelect,
  ExplorerLink,
} from '../cluster/cluster-ui';
import { WalletButton } from '../solana/solana-provider';
import Link from 'next/link';

export function UiLayout({
  children,
  links,
}: {
  children: ReactNode;
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();

  return (
    <div className='h-full flex flex-col'>
      <div className='navbar bg-indigo-400 text-neutral-content flex-col md:flex-row space-y-2 md:space-y-0'>
        <div className='flex-1'>
          <div className='flex mx-2 items-center'>
            <Link href={'/'}>
              <p className='text-pretty px-2 text-xl text-stone-950'>
                SolKratus
              </p>
            </Link>
            <Link href='/create'>
              <p className='text-pretty textarea-sm px-2 text-stone-950'>
                Create Poll
              </p>
            </Link>
            <Link href='/list'>
              <p className='text-pretty textarea-sm px-2 text-stone-950'>
                Poll List
              </p>
            </Link>
          </div>
        </div>
        <div className='flex-none space-x-2'>
          <WalletButton />
          <ClusterUiSelect />
        </div>
      </div>

      <div className='flex-grow w-full max-w-screen-lg px-4 mx-auto'>
        <Suspense
          fallback={
            <div className='text-center my-32'>
              <span className='loading loading-spinner loading-lg'></span>
            </div>
          }
        >
          {children}
        </Suspense>
        <Toaster position='bottom-right' />
      </div>
      <footer className='footer footer-center p-4 bg-base-300 text-base-content'>
        <aside>
          <p>Created by Apollo Surfer</p>
        </aside>
      </footer>
    </div>
  );
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode;
  title: string;
  hide: () => void;
  show: boolean;
  submit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    if (show) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [show, dialogRef]);

  return (
    <dialog className='modal' ref={dialogRef}>
      <div className='modal-box space-y-5'>
        <h3 className='font-bold text-lg'>{title}</h3>
        {children}
        <div className='modal-action'>
          <div className='join space-x-2'>
            {submit ? (
              <button
                className='btn btn-xs lg:btn-md btn-primary'
                onClick={submit}
                disabled={submitDisabled}
              >
                {submitLabel || 'Save'}
              </button>
            ) : null}
            <button onClick={hide} className='btn'>
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
}) {
  return (
    <div className='hero py-[48px]'>
      <div className='hero-content text-center'>
        <div className='max-w-2xl'>
          {typeof title === 'string' ? (
            <h1 className='text-5xl font-bold'>{title}</h1>
          ) : (
            title
          )}
          {typeof subtitle === 'string' ? (
            <p className='py-2'>{subtitle}</p>
          ) : (
            subtitle
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return (
      str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
    );
  }
  return str;
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={'text-center'}>
        <div className='text-lg'>Transaction sent</div>
        <ExplorerLink
          path={`tx/${signature}`}
          label={'View Transaction'}
          className='btn btn-xs btn-primary'
        />
      </div>
    );
  };
}
