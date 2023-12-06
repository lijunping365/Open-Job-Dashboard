import HomeSEO from '@/seo/Home.seo';
import Header from '@/components/Header';
import Link from 'next/link';
import Footer from '@/components/Footer';
import BaseLayout from '@/components/Layout';

export default function HomePage() {
  return (
    <>
      <BaseLayout>
        <HomeSEO />
        <Header />

        <div className='relative isolate bg-wash px-4 dark:bg-wash-dark lg:px-8'>
          <div className='mx-auto max-w-2xl py-12 lg:py-24'>
            <div className='text-center'>
              <h1 className='text-4xl font-bold tracking-tight text-gray-800 dark:text-wash sm:text-6xl'>
                Open-Idea
              </h1>
              <p className='mt-6 text-lg leading-8 text-gray-600 dark:text-wash'>
                随时随地记录你的想法，轻松搭建私有知识库
              </p>
              <div className='mt-10 flex items-center justify-center gap-x-6'>
                <Link
                  href={`/space/home`}
                  className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                >
                  Get started
                </Link>
                <a
                  href='https://openbytecode.com/project/open-idea'
                  className='text-sm font-semibold leading-6 text-link dark:text-link-dark'
                >
                  Learn more <span aria-hidden='true'>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </BaseLayout>
    </>
  );
}
