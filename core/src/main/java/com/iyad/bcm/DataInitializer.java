package com.iyad.bcm;

import com.iyad.model.MyUser;
import com.iyad.model.Project;
import com.iyad.model.ProjectUser;
import com.iyad.repository.ProjectRepository;
import com.iyad.repository.ProjectUserRepository;
import com.iyad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile({"dev", "test"})
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectUserRepository projectUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByUsername("admin").isEmpty()) {
            MyUser user = new MyUser();
            user.setUsername("admin");
            user.setPassword(passwordEncoder.encode("admin"));
            userRepository.save(user);

            Project project = new Project();
            project.setName("AdminProject1");
            projectRepository.save(project);


            Project project2 = new Project();
            project2.setName("AdminProject2");
            projectRepository.save(project2);

            ProjectUser projectUser = new ProjectUser();
            projectUser.setProject(project);
            projectUser.setUser(user);
            projectUserRepository.save(projectUser);

            ProjectUser projectUser2 = new ProjectUser();
            projectUser2.setProject(project2);
            projectUser2.setUser(user);
            projectUserRepository.save(projectUser2);
        }

        if (userRepository.findByUsername("iyad").isEmpty()) {
            MyUser user = new MyUser();
            user.setUsername("iyad");
            user.setPassword(passwordEncoder.encode("iyad"));
            userRepository.save(user);

            Project project = new Project();
            project.setName("IyadProject");
            projectRepository.save(project);

            ProjectUser projectUser = new ProjectUser();
            projectUser.setProject(project);
            projectUser.setUser(user);
            projectUserRepository.save(projectUser);
        }
    }
}
