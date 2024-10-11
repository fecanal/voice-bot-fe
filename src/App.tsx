import { BrowserRouter, Route, Routes } from '@modern-js/runtime/router';
import Home from './routes/page';
import './index.css';
export default () => {
  return (
    <BrowserRouter>
      <Routes>
        {/*<Route index element={<div>index</div>} />*/}
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};
