import HomeSEO from '@/seo/Home.seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BaseLayout from '@/components/Layout';

import {Button} from 'antd'
export default function HomePage() {
  return (
    <>
      <BaseLayout>
        <HomeSEO />
        <Header />

        <Button type="primary">Button</Button>



        <Footer />
      </BaseLayout>
    </>
  );
}
