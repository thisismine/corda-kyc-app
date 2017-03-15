package com.capgemini.kycapp.api;

import static java.util.Collections.singletonMap;
import static java.util.stream.Collectors.toList;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
//import org.apache.tomcat.util.codec.binary.Base64;
import java.util.Base64;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.capgemini.kycapp.contract.KycContract;
import com.capgemini.kycapp.contract.KycState;
import com.capgemini.kycapp.flow.KYCFlow;
import com.capgemini.kycapp.model.UserKycInfo;

import net.corda.core.contracts.ContractState;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.crypto.Party;
import net.corda.core.crypto.SecureHash;
import net.corda.core.messaging.CordaRPCOps;

// This API is accessible from /api/example. All paths specified below are relative to it.
@Path("example")
public class KYCApi {
    private final CordaRPCOps services;
    private final String myLegalName;

    final Logger logger = LoggerFactory.getLogger(KYCApi.class);

    public KYCApi(CordaRPCOps services) {
        this.services = services;
        this.myLegalName = services.nodeIdentity().getLegalIdentity().getName();
    }

    /**
     * Returns the party name of the node providing this end-point.
     */
    @GET
    @Path("me")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, String> whoami() { return singletonMap("me", myLegalName); }

    /**
     * Returns all parties registered with the [NetworkMapService]. The names can be used to look up identities by
     * using the [IdentityService].
     */
    @GET
    @Path("peers")
    @Produces(MediaType.APPLICATION_JSON)
    public Map<String, List<String>> getPeers() {
        final String NOTARY_NAME = "Controller";
        return singletonMap(
                "peers",
                services.networkMapUpdates().getFirst()
                        .stream()
                        .map(node -> node.getLegalIdentity().getName())
                        .filter(name -> !name.equals(myLegalName) && !name.equals(NOTARY_NAME))
                        .collect(toList()));
    }

    /**
     * Displays all purchase order states that exist in the vault.
     */
    @GET
    @Path("kyc-docs")
    @Produces(MediaType.APPLICATION_JSON)
    public List<StateAndRef<ContractState>> getKycDocs()
    {
        return services.vaultAndUpdates().getFirst();
    }
    
    /*
     * Search KYCs based on user id
     * GET Request::
     * http://localhost:10007/api/kyc/<user_id>/get-kycs-by-userid
     */
    @GET
    @Path("{userId}/get-kycs-by-userid")
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserKycInfo> getKYCsByUserId(@PathParam("userId") String userId) {
    	
    	List<UserKycInfo> returnRecords = new ArrayList<UserKycInfo>();
    	
    	List<StateAndRef<ContractState>> allRecords = services.vaultAndUpdates().getFirst();
    	
    	for(int i=0; i<allRecords.size();i++){
    		
    		StateAndRef<ContractState> singleRecord = (StateAndRef<ContractState>) allRecords.get(i);
    		
    		KycState state = (KycState) singleRecord.getState().getData();
    		
    		if(state.getUserKycInfo().getUserId() == Integer.parseInt(userId) ){
    			returnRecords.add(state.getUserKycInfo());
    		}
    	}
    	// return only one record based on kycDate which is created last
    	UserKycInfo lastKYC = Collections.max(returnRecords, Comparator.comparing(UserKycInfo::getKycCreateDate));
    	
    	returnRecords.clear();
    	returnRecords.add(lastKYC);
    	
        return returnRecords;
    }


    /**k
     * This should only be called from the 'buyer' node. It initiates a flow to agree a purchase order with a
     * seller. Once the flow finishes it will have written the purchase order to ledger. Both the buyer and the
     * seller will be able to see it when calling /api/example/purchase-orders on their respective nodes.
     *
     * This end-point takes a Party name parameter as part of the path. If the serving node can't find the other party
     * in its network map cache, it will return an HTTP bad request.
     *
     * The flow is invoked asynchronously. It returns a future when the flow's call() method returns.
     * @throws IOException 
     */
    @PUT
    @Path("/createKycDoc")
    public Response createKycDoc(UserKycInfo userKycInfo)  throws InterruptedException, ExecutionException, IOException
    {
    	System.out.println("Calling corda api.....");
        Map<String, List<String>> allPeers = getPeers();

       // Party initiator  = services.nodeIdentity().getLegalIdentity();
        List<String> allStrNodes = allPeers.get("peers");
        List<Party> otherParties = new ArrayList<>();

        if(allStrNodes!=null)
        {
            for ( String temp : allStrNodes ) {
                Party tempParty = null;
                if(temp!=null && !temp.equalsIgnoreCase("NetworkMapService"))
                {
                    tempParty = services.partyFromName(temp);
                    if(tempParty!=null)
                    {
                        otherParties.add(tempParty);
                    }
                }
            }
        }
        Calendar currDate = Calendar.getInstance();
        userKycInfo.setKycCreateDate(currDate.getTime());
        currDate.add(Calendar.YEAR, 1);
        userKycInfo.setKycValidTillDate(currDate.getTime());

        final KycState state = new KycState(
                userKycInfo,
                services.nodeIdentity().getLegalIdentity(),
                otherParties ,
                new KycContract());
        
        /** Add attachment - Added attachment logic into ExampleFlow.java */
        String filePath = new File("").getAbsolutePath() + File.separator + userKycInfo.getUserId() +"_kyc.zip";       
        
        System.out.println("Attachment's filePath......"+ filePath);
        InputStream in = null;
        try{
           //byte[] bytes = "Hello, World!".getBytes("UTF-8");
           //String encoded = Base64.getEncoder().encodeToString(bytes);
           byte[] decoded = Base64.getDecoder().decode(userKycInfo.getKycDocBlob());                       
           FileOutputStream fop = new FileOutputStream(filePath);

           fop.write(decoded);
           fop.flush();
           fop.close();
          
            URL newFileURL = new File(filePath).toURI().toURL();
            //java.io.BufferedInputStream will be created by openStream()
            in = newFileURL.openStream();
            
        }catch(Exception e){
           e.printStackTrace();
        }
        
        System.out.println("File input stream created....."+in);    
        
        SecureHash attachmentHashValue =  services.uploadAttachment(in);       

         /** End attachment */

        // The line below blocks and waits for the flow to return.
        final KYCFlow.KYCFlowResult result =
                services.startFlowDynamic(KYCFlow.Initiator.class, state, otherParties, attachmentHashValue)
            .getReturnValue()
            .toBlocking()
            .first();

        final Response.Status status;
        if (result instanceof KYCFlow.KYCFlowResult.Success) {
            status = Response.Status.CREATED;
        } else {
            status = Response.Status.BAD_REQUEST;
        }

        return Response
                .status(status)
                .entity(result.toString())
                .build();
    }
}