import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import NavDot from '../../components/NavDot';
import AboutMe from '../../components/AboutMe';
import Contact from '../../components/Contact';
import Default from '../../components/Default';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Skills from '../../components/Skills';
import Works from '../../components/Works';

function Main(props) {
  let { dispatch, app } = props;

  let timer = 0;
  /**
   * @method 统一处理滚轮滚动事件
   */
  const wheel = (event) => {
    clearTimeout(timer);
    timer = setTimeout(function(){
      var delta = 0;
      event = !event ? window.event : event;
      if (event.wheelDelta) { //IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
        delta = event.wheelDelta / 120;
        if (window.opera) {
          delta = - delta; //因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
        }
      } else if (event.detail) { //FF浏览器使用的是detail,其值为“正负3”
        delta = - event.detail / 3;
      }
      if (delta){
        console.log('delta', delta);
        if (delta < 0) { //向下滚动
          turnNext('down');
        } else { //向上滚动
          turnNext('top');
        }
      }
    }, 100);
  }
  //判断鼠标滚轮滚动方向
  if (window.addEventListener){ //FF,火狐浏览器会识别该方法
    window.addEventListener('DOMMouseScroll', wheel, false);
  }
  window.onmousewheel = document.onmousewheel = wheel; //W3C
  
  /** 
   * @method 进入下/上一页
   * @param {string} type,滚轮的滚动方向; 不传则表示点击事件
   */
  const turnNext = (type, pageIndex) =>{
    let index = 0;
    if(!pageIndex){
      pageIndex = app.pageIndex;
      if(type === 'top'){
        if(pageIndex === 0){
          index = 4;
        }else{
          index = pageIndex - 1;
        }
      }else if(type === 'down'){
        if(pageIndex === 4){
          index = 0;
        }else{
          index = pageIndex + 1;
        }
      }else{
        if(pageIndex === 4){
          index = 0;
        }else{
          index = pageIndex + 1;
        }
      }
    }
    dispatch({
      type: 'app/changeState',
      payload:{
        pageIndex: index
      }
    })
  }
  
  /**
   * @method 根据pageIndex返回相应的页面
   * pageList: [
   *   'Default', 'AboutMe', 'Skills', 'Works', 'Contact'
   * ]
   */
  const getContent = () =>{
    if(app.pageIndex === 1){
      return <AboutMe />
    }else if(app.pageIndex === 2){
      return <Skills />
    }else if(app.pageIndex === 3){
      return <Works />
    }else if(app.pageIndex === 4){
      return <Contact />
    }else{
      return <Default />
    }
  }

  return (
    <div className={styles.mainWrapper}>
      <Header />
      <NavDot pageIndex={app.pageIndex} onClick={turnNext}/>
      <div className={styles.content}>
        { getContent() }
      </div>
      <Footer onClick={turnNext}/>
    </div>
  );
}

Main.propTypes = {
};

function mapStateToProps(state) {
  return {
    app: state.app,
  };
}
export default connect(mapStateToProps)(Main);