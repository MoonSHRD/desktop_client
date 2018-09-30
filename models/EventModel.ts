import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, ManyToOne} from "typeorm";
import {ChatModel} from "./ChatModel";

@Entity()
export class EventModel extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    text: string;
    @Column()
    time: string;
    @Column()
    type: string;

    @ManyToOne(type => ChatModel, chat => chat.events)
    @JoinColumn()
    chat: ChatModel;
}
