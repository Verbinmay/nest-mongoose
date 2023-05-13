import { CreateBlogDto } from './create-blog.dto';

export class UpdateBlogDto extends CreateBlogDto {}

/**В вашем конкретном примере класс UpdateBlogDto расширяет класс CreateBlogDto и использует утилиту PartialType, чтобы сделать все свойства CreateBlogDto необязательными. Это позволяет использовать UpdateBlogDto для обновления объекта блога, при этом можно передавать только те свойства, которые необходимо изменить, а остальные свойства будут оставлены без изменений. */
// export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
