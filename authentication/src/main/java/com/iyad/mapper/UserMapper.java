package com.iyad.mapper;

import com.iyad.dto.UserDTO;
import com.iyad.model.MyUser;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "username", source = "username")
    @Mapping(target = "password", source = "password")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "phoneNumber", source = "phoneNumber")
    @Mapping(target = "joinAt", source = "joinAt")
    UserDTO toDTO(MyUser myuser);

    @Mapping(target = "username", source = "username")
    @Mapping(target = "password", source = "password")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "phoneNumber", source = "phoneNumber")
    @Mapping(target = "joinAt", source = "joinAt")
    @Mapping(target = "id", ignore = true)
    MyUser toEntity(UserDTO userDTO);
}
