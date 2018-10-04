import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn} from "typeorm";
import {UserModel} from "./UserModel";
import {ChatModel} from "./ChatModel";
// import {ChatModel} from "./ChatModel";

@Entity()
export class FileModel extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    chat_id: string = '';
    @Column()
    usernmame: string = '';
    @Column()
    link: string = '';
    @Column()
    message_id: number;

}