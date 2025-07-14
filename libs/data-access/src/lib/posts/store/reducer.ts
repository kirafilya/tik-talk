import {createFeature, createReducer, on} from '@ngrx/store';
import {postsActions} from './actions';
import {Post} from '@tt/data-access';

//Сначала создает интерфейс стора
export interface PostsState {
  posts: Post[]
}
//Задаем начальные значения
export const postsInitialState: PostsState = {
  posts: []
}
//Здесь уже конкретно создает редьюсер
export const postsFeature = createFeature({
  name: 'postsFeature',
  reducer: createReducer(
    postsInitialState,
// в метод on передаем экшн, который "слушает" рельюсер, начальное значение стейта и то, что будем класть в стейт
    on(postsActions.postsLoaded, (state, payload) => {
      //стейт полностью обновляется на новый объект, кладем старое значение стейта и наши посты
      return {
        ...state,
        posts: payload.posts,
      }
    })
  )
})
