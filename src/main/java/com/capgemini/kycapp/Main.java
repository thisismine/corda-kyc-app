package com.capgemini.kycapp;

import net.corda.core.node.services.ServiceInfo;
import net.corda.node.services.User;
import net.corda.node.services.transactions.ValidatingNotaryService;

import static java.util.Collections.*;
import static net.corda.node.driver.Driver.driver;


public class Main {
    public static void main(String[] args) {
        // No permissions required as we are not invoking flows.
        final User user = new User("user1", "test", emptySet());
        driver(
                true,
                dsl -> {
                    dsl.startNode("Controller",
                            singleton(new ServiceInfo(ValidatingNotaryService.Companion.getType(), null)),
                            emptyList(),
                            emptyMap());
                    dsl.startNode("NodeA", emptySet(), singletonList(user), emptyMap());
                    dsl.startNode("NodeB", emptySet(), singletonList(user), emptyMap());
                    dsl.startNode("NodeC", emptySet(), singletonList(user), emptyMap());
                    dsl.waitForAllNodesToFinish();
                    return null;
                }
        );
    }
}
